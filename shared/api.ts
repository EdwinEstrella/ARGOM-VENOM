// Contrato entre el proceso main de Electron y la interfaz (renderer).
// Lo importan electron/ (implementación) y el frontend (consumo), así que
// solo debe contener tipos y constantes sin dependencias.

export type Result<T = void> =
    | { ok: true; data: T }
    | { ok: false; error: string };

export interface AuthStatus {
    configured: boolean;
    authenticated: boolean;
    username: string | null;
}

export type TelegramStatus =
    | 'disconnected'
    | 'connecting'
    | 'awaiting_code'
    | 'awaiting_password'
    | 'connected'
    | 'error';

export interface TelegramStatusEvent {
    status: TelegramStatus;
    error?: string;
    passwordHint?: string;
}

export interface TelegramConfig {
    apiId: string;
    phone: string;
    groups: string[];
    keywords: string[];
    autoConnect: boolean;
    /** El api_hash nunca sale del proceso main; solo se indica si existe. */
    hasApiHash: boolean;
    /** Hay una sesión de Telegram guardada (no hace falta volver a pedir código). */
    hasSession: boolean;
}

export interface TelegramConfigInput {
    apiId: string;
    /** Se omite para conservar el api_hash ya guardado. */
    apiHash?: string;
    phone: string;
    groups: string[];
    keywords: string[];
    autoConnect: boolean;
}

export type MessageTag = 'dexscreener' | 'pumpfun' | 'twitter' | 'solana' | 'token';

export interface TelegramMessage {
    id: number;
    chatId: string;
    chatName: string;
    senderName: string | null;
    text: string;
    keywords: string[];
    tags: MessageTag[];
    /** ISO 8601 */
    sentAt: string;
}

export interface MessageQuery {
    limit?: number;
    chatName?: string;
}

export interface ArgomAPI {
    isElectron: true;
    platform: string;
    auth: {
        status(): Promise<AuthStatus>;
        setup(username: string, password: string): Promise<Result<AuthStatus>>;
        login(password: string, remember: boolean): Promise<Result<AuthStatus>>;
        logout(): Promise<Result<AuthStatus>>;
        changePassword(current: string, next: string): Promise<Result>;
    };
    telegram: {
        getConfig(): Promise<Result<TelegramConfig>>;
        saveConfig(input: TelegramConfigInput): Promise<Result<TelegramConfig>>;
        getStatus(): Promise<Result<TelegramStatusEvent>>;
        connect(): Promise<Result>;
        disconnect(): Promise<Result>;
        submitCode(code: string): Promise<Result>;
        submitPassword(password: string): Promise<Result>;
        forgetSession(): Promise<Result>;
        getMessages(query?: MessageQuery): Promise<Result<TelegramMessage[]>>;
        clearMessages(): Promise<Result>;
        /** Devuelven una función para quitar el listener. */
        onStatus(cb: (e: TelegramStatusEvent) => void): () => void;
        onMessage(cb: (m: TelegramMessage) => void): () => void;
    };
}

export const IPC = {
    authStatus: 'auth:status',
    authSetup: 'auth:setup',
    authLogin: 'auth:login',
    authLogout: 'auth:logout',
    authChangePassword: 'auth:change-password',
    tgGetConfig: 'telegram:get-config',
    tgSaveConfig: 'telegram:save-config',
    tgGetStatus: 'telegram:get-status',
    tgConnect: 'telegram:connect',
    tgDisconnect: 'telegram:disconnect',
    tgSubmitCode: 'telegram:submit-code',
    tgSubmitPassword: 'telegram:submit-password',
    tgForgetSession: 'telegram:forget-session',
    tgGetMessages: 'telegram:get-messages',
    tgClearMessages: 'telegram:clear-messages',
    tgStatusEvent: 'telegram:status',
    tgMessageEvent: 'telegram:message',
} as const;
