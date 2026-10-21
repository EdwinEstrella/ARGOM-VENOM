import { EventEmitter } from 'node:events';
import type { TelegramConfig, TelegramConfigInput, TelegramMessage, TelegramStatusEvent } from '../../../shared/api';
import type { Settings } from '../database';
import type { SecretBox } from '../secrets';
import { filterMessage, type FilterRules } from './filter';
import type { AuthPrompts, RawMessage, TelegramGateway } from './gateway';
import type { MessageStore } from './messages';

interface StoredConfig {
    apiId: string;
    phone: string;
    groups: string[];
    keywords: string[];
    autoConnect: boolean;
}

const CONFIG_KEY = 'telegram.config';
const API_HASH_KEY = 'telegram.apiHash';
const SESSION_KEY = 'telegram.session';

const DEFAULT_CONFIG: StoredConfig = {
    apiId: '',
    phone: '',
    groups: [],
    keywords: ['dexscreener.com', 'pump.fun', 'x.com', 'solana', 'token'],
    autoConnect: false,
};

const CANCELLED = 'TELEGRAM_CANCELLED';

// Códigos de error de Telegram que el usuario puede corregir sin reiniciar el login.
const RETRY_CODE = new Set(['PHONE_CODE_INVALID', 'PHONE_CODE_EMPTY']);
const RETRY_PASSWORD = new Set(['PASSWORD_HASH_INVALID']);

const FRIENDLY_ERRORS: Record<string, string> = {
    PHONE_CODE_INVALID: 'Código incorrecto, vuelve a intentarlo',
    PHONE_CODE_EMPTY: 'Introduce el código',
    PHONE_CODE_EXPIRED: 'El código ha caducado, conecta de nuevo',
    PASSWORD_HASH_INVALID: 'Contraseña de verificación en dos pasos incorrecta',
    API_ID_INVALID: 'API ID o API Hash no válidos',
    PHONE_NUMBER_INVALID: 'Número de teléfono no válido (usa formato internacional, p. ej. +34...)',
    PHONE_NUMBER_BANNED: 'Este número está bloqueado por Telegram',
};

export class TelegramError extends Error {}

function errorCode(err: unknown): string | undefined {
    return (err as { errorMessage?: string } | null)?.errorMessage;
}

export function describeTelegramError(err: unknown): string {
    const code = errorCode(err);
    if (code === 'FLOOD') {
        const seconds = (err as { seconds?: number }).seconds;
        return `Telegram limita los intentos: espera ${seconds ?? 'unos'} segundos`;
    }
    if (code && FRIENDLY_ERRORS[code]) {
        return FRIENDLY_ERRORS[code];
    }
    return err instanceof Error ? err.message : String(err);
}

interface Deferred<T> {
    promise: Promise<T>;
    resolve(value: T): void;
    reject(err: Error): void;
}

function deferred<T>(): Deferred<T> {
    let resolve!: (value: T) => void;
    let reject!: (err: Error) => void;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}

export interface TelegramServiceEvents {
    status: [TelegramStatusEvent];
    message: [TelegramMessage];
}

/**
 * Orquesta la conexión con Telegram: guarda configuración y credenciales
 * (cifradas), conduce el login interactivo (código / 2FA) a través de la UI,
 * filtra los mensajes entrantes y los persiste.
 */
export class TelegramService extends EventEmitter<TelegramServiceEvents> {
    private state: TelegramStatusEvent = { status: 'disconnected' };
    private gateway: TelegramGateway | null = null;
    private pendingCode: Deferred<string> | null = null;
    private pendingPassword: Deferred<string> | null = null;
    /** Intento de conexión en curso; cada connect() crea uno nuevo. */
    private attempt: { cancelled: boolean } | null = null;
    private rules: FilterRules;

    constructor(
        private readonly settings: Settings,
        private readonly secrets: SecretBox,
        private readonly store: MessageStore,
        private readonly createGateway: () => TelegramGateway,
    ) {
        super();
        const config = this.storedConfig();
        this.rules = { groups: config.groups, keywords: config.keywords };
    }

    getStatus(): TelegramStatusEvent {
        return this.state;
    }

    getConfig(): TelegramConfig {
        return {
            ...this.storedConfig(),
            hasApiHash: this.settings.get(API_HASH_KEY) !== undefined,
            hasSession: this.settings.get(SESSION_KEY) !== undefined,
        };
    }

    saveConfig(input: TelegramConfigInput): TelegramConfig {
        const apiId = String(input.apiId ?? '').trim();
        const phone = String(input.phone ?? '').replace(/[\s-]/g, '');
        if (apiId && !/^\d+$/.test(apiId)) {
            throw new TelegramError('El API ID debe ser numérico');
        }
        if (phone && !/^\+\d{6,15}$/.test(phone)) {
            throw new TelegramError('El teléfono debe estar en formato internacional, p. ej. +34600111222');
        }
        const clean = (list: unknown) =>
            Array.isArray(list) ? [...new Set(list.map(v => String(v).trim()).filter(Boolean))] : [];

        const previous = this.storedConfig();
        const next: StoredConfig = {
            apiId,
            phone,
            groups: clean(input.groups),
            keywords: clean(input.keywords),
            autoConnect: Boolean(input.autoConnect),
        };

        const apiHash = input.apiHash?.trim();
        if (apiHash) {
            if (!/^[0-9a-f]{32}$/i.test(apiHash)) {
                throw new TelegramError('El API Hash debe tener 32 caracteres hexadecimales');
            }
            this.settings.set(API_HASH_KEY, this.secrets.seal(apiHash));
        }
        // La sesión pertenece a una cuenta y una app concretas: si cambian, deja de valer.
        if (previous.phone !== next.phone || previous.apiId !== next.apiId || apiHash) {
            this.settings.delete(SESSION_KEY);
        }

        this.settings.set(CONFIG_KEY, next);
        this.rules = { groups: next.groups, keywords: next.keywords };
        return this.getConfig();
    }

    async connect(): Promise<void> {
        if (this.gateway) {
            return;
        }
        const config = this.storedConfig();
        const sealedHash = this.settings.get<string>(API_HASH_KEY);
        if (!config.apiId || !config.phone || !sealedHash) {
            throw new TelegramError('Configura API ID, API Hash y teléfono antes de conectar');
        }

        const sealedSession = this.settings.get<string>(SESSION_KEY);
        const gateway = this.createGateway();
        const attempt = { cancelled: false };
        this.gateway = gateway;
        this.attempt = attempt;
        let lastError: unknown;
        this.setStatus({ status: 'connecting' });

        const prompts: AuthPrompts = {
            phoneCode: () => {
                this.pendingCode = deferred();
                if (this.state.status !== 'awaiting_code') {
                    this.setStatus({ status: 'awaiting_code' });
                }
                return this.pendingCode.promise;
            },
            password: hint => {
                this.pendingPassword = deferred();
                if (this.state.status !== 'awaiting_password') {
                    this.setStatus({ status: 'awaiting_password', passwordHint: hint });
                }
                return this.pendingPassword.promise;
            },
            onError: err => {
                if (attempt.cancelled) {
                    return true;
                }
                const code = errorCode(err);
                if (code && RETRY_CODE.has(code)) {
                    this.setStatus({ status: 'awaiting_code', error: describeTelegramError(err) });
                    return false;
                }
                if (code && RETRY_PASSWORD.has(code)) {
                    this.setStatus({ ...this.state, status: 'awaiting_password', error: describeTelegramError(err) });
                    return false;
                }
                lastError = err;
                return true;
            },
        };

        try {
            const session = await gateway.connect(
                {
                    apiId: Number(config.apiId),
                    apiHash: this.secrets.open(sealedHash),
                    phone: config.phone,
                    session: sealedSession ? this.secrets.open(sealedSession) : '',
                },
                prompts,
            );
            if (attempt.cancelled) {
                return;
            }
            this.settings.set(SESSION_KEY, this.secrets.seal(session));
            gateway.onMessage(raw => this.handleMessage(raw));
            this.setStatus({ status: 'connected' });
        } catch (err) {
            await this.teardown(gateway);
            // Un intento cancelado (o ya sustituido por otro) no debe tocar el estado actual.
            if (attempt.cancelled) {
                return;
            }
            const message = describeTelegramError(lastError ?? err);
            this.setStatus({ status: 'error', error: message });
            throw new TelegramError(message);
        } finally {
            if (this.attempt === attempt) {
                this.attempt = null;
                this.pendingCode = null;
                this.pendingPassword = null;
            }
        }
    }

    submitCode(code: string): void {
        const trimmed = String(code ?? '').trim();
        if (!this.pendingCode) {
            throw new TelegramError('Telegram no está esperando un código');
        }
        if (!trimmed) {
            throw new TelegramError('Introduce el código');
        }
        this.pendingCode.resolve(trimmed);
        this.pendingCode = null;
        this.setStatus({ status: 'connecting' });
    }

    submitPassword(password: string): void {
        if (!this.pendingPassword) {
            throw new TelegramError('Telegram no está esperando la contraseña');
        }
        if (!password) {
            throw new TelegramError('Introduce la contraseña');
        }
        this.pendingPassword.resolve(password);
        this.pendingPassword = null;
        this.setStatus({ status: 'connecting' });
    }

    async disconnect(): Promise<void> {
        if (this.attempt) {
            this.attempt.cancelled = true;
            this.attempt = null;
        }
        const cancel = new Error(CANCELLED);
        this.pendingCode?.reject(cancel);
        this.pendingPassword?.reject(cancel);
        this.pendingCode = null;
        this.pendingPassword = null;
        if (this.gateway) {
            await this.teardown(this.gateway);
        }
        this.setStatus({ status: 'disconnected' });
    }

    /** Desconecta y borra la sesión guardada: la próxima conexión pedirá código. */
    async forgetSession(): Promise<void> {
        await this.disconnect();
        this.settings.delete(SESSION_KEY);
    }

    private handleMessage(raw: RawMessage): void {
        const match = filterMessage(this.rules, { chatTitle: raw.chatTitle, chatUsername: raw.chatUsername, text: raw.text });
        if (!match) {
            return;
        }
        const saved = this.store.insert({
            chatId: raw.chatId,
            chatName: raw.chatTitle ?? raw.chatUsername ?? raw.chatId,
            senderName: raw.senderName,
            text: raw.text,
            keywords: match.keywords,
            tags: match.tags,
            sentAt: raw.date.toISOString(),
        });
        this.emit('message', saved);
    }

    private async teardown(gateway: TelegramGateway): Promise<void> {
        if (this.gateway === gateway) {
            this.gateway = null;
        }
        await gateway.disconnect().catch(() => undefined);
    }

    private setStatus(next: TelegramStatusEvent): void {
        this.state = next;
        this.emit('status', next);
    }

    private storedConfig(): StoredConfig {
        return { ...DEFAULT_CONFIG, ...this.settings.get<Partial<StoredConfig>>(CONFIG_KEY) };
    }
}
