import { ipcMain, type IpcMainInvokeEvent, type WebContents } from 'electron';
import { IPC, type MessageQuery, type Result, type TelegramConfigInput } from '../shared/api';
import { AuthError, type AuthService } from './services/auth';
import { TelegramError, type TelegramService } from './services/telegram/service';
import type { MessageStore } from './services/telegram/messages';

interface Services {
    auth: AuthService;
    telegram: TelegramService;
    messages: MessageStore;
}

interface IpcOptions {
    /** Decide si la petición viene de nuestra propia interfaz. */
    isTrustedSender(event: IpcMainInvokeEvent): boolean;
    /** Ventana a la que se envían los eventos en vivo. */
    target(): WebContents | null;
    /** Se llama tras iniciar sesión, para tareas como la autoconexión de Telegram. */
    onAuthenticated(): void;
}

const isExpected = (err: unknown) => err instanceof AuthError || err instanceof TelegramError;

export function registerIpc({ auth, telegram, messages }: Services, opts: IpcOptions): void {
    const handle = <A extends unknown[], T>(
        channel: string,
        fn: (...args: A) => T | Promise<T>,
        { requireAuth = true } = {},
    ) => {
        ipcMain.handle(channel, async (event, ...args): Promise<Result<T>> => {
            if (!opts.isTrustedSender(event)) {
                return { ok: false, error: 'Origen no permitido' };
            }
            if (requireAuth && !auth.isAuthenticated()) {
                return { ok: false, error: 'No autenticado' };
            }
            try {
                return { ok: true, data: await fn(...(args as A)) };
            } catch (err) {
                if (!isExpected(err)) {
                    console.error(`[ipc] ${channel}:`, err);
                }
                return { ok: false, error: err instanceof Error ? err.message : String(err) };
            }
        });
    };

    ipcMain.handle(IPC.authStatus, event => {
        if (!opts.isTrustedSender(event)) {
            throw new Error('Origen no permitido');
        }
        return auth.status();
    });

    handle(
        IPC.authSetup,
        (username: string, password: string) => {
            const status = auth.setup(String(username ?? ''), String(password ?? ''));
            opts.onAuthenticated();
            return status;
        },
        { requireAuth: false },
    );

    handle(
        IPC.authLogin,
        (password: string, remember: boolean) => {
            const status = auth.login(String(password ?? ''), Boolean(remember));
            opts.onAuthenticated();
            return status;
        },
        { requireAuth: false },
    );

    handle(
        IPC.authLogout,
        async () => {
            await telegram.disconnect();
            return auth.logout();
        },
        { requireAuth: false },
    );

    handle(IPC.authChangePassword, (current: string, next: string) =>
        auth.changePassword(String(current ?? ''), String(next ?? '')),
    );

    handle(IPC.tgGetConfig, () => telegram.getConfig());
    handle(IPC.tgSaveConfig, (input: TelegramConfigInput) => telegram.saveConfig(input ?? ({} as TelegramConfigInput)));
    handle(IPC.tgGetStatus, () => telegram.getStatus());
    handle(IPC.tgConnect, () => telegram.connect());
    handle(IPC.tgDisconnect, () => telegram.disconnect());
    handle(IPC.tgSubmitCode, (code: string) => telegram.submitCode(code));
    handle(IPC.tgSubmitPassword, (password: string) => telegram.submitPassword(password));
    handle(IPC.tgForgetSession, () => telegram.forgetSession());
    handle(IPC.tgGetMessages, (query?: MessageQuery) => messages.list(query ?? {}));
    handle(IPC.tgClearMessages, () => messages.clear());

    const send = (channel: string, payload: unknown) => {
        const target = opts.target();
        if (target && !target.isDestroyed() && auth.isAuthenticated()) {
            target.send(channel, payload);
        }
    };
    telegram.on('status', status => send(IPC.tgStatusEvent, status));
    telegram.on('message', message => send(IPC.tgMessageEvent, message));
}
