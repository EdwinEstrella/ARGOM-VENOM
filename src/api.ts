import type { ArgomAPI, AuthStatus, Result, TelegramConfig } from '../shared/api';

declare global {
    interface Window {
        argom?: ArgomAPI;
    }
}

export const isElectron = (): boolean => Boolean(window.argom);

const desktopOnly = async (): Promise<Result<never>> => ({ ok: false, error: 'Disponible solo en la app de escritorio' });

/**
 * Sustituto para `npm run dev` en el navegador: permite trabajar la interfaz
 * sin Electron. No guarda nada y acepta cualquier contraseña.
 */
function createBrowserApi(): ArgomAPI {
    let status: AuthStatus = { configured: true, authenticated: false, username: 'dev' };
    const config: TelegramConfig = {
        apiId: '',
        phone: '',
        groups: [],
        keywords: [],
        autoConnect: false,
        hasApiHash: false,
        hasSession: false,
    };
    const ok = async <T,>(data: T): Promise<Result<T>> => ({ ok: true, data });

    return {
        isElectron: true,
        platform: 'web',
        auth: {
            status: async () => status,
            setup: async username => ok((status = { configured: true, authenticated: true, username })),
            login: async () => ok((status = { ...status, authenticated: true })),
            logout: async () => ok((status = { ...status, authenticated: false })),
            changePassword: async () => ok(undefined),
        },
        telegram: {
            getConfig: () => ok(config),
            saveConfig: desktopOnly,
            getStatus: () => ok({ status: 'disconnected' as const }),
            connect: desktopOnly,
            disconnect: () => ok(undefined),
            submitCode: desktopOnly,
            submitPassword: desktopOnly,
            forgetSession: () => ok(undefined),
            getMessages: () => ok([]),
            clearMessages: () => ok(undefined),
            onStatus: () => () => undefined,
            onMessage: () => () => undefined,
        },
    };
}

export const api: ArgomAPI = window.argom ?? createBrowserApi();

/** Desenvuelve un Result lanzando su error, para usar con try/catch en la UI. */
export async function unwrap<T>(result: Promise<Result<T>>): Promise<T> {
    const r = await result;
    if (!r.ok) {
        throw new Error(r.error);
    }
    return r.data;
}
