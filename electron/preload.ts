import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';
import { IPC, type ArgomAPI } from '../shared/api';

// Con sandbox activado el preload no puede importar módulos propios en tiempo
// de ejecución: Vite incrusta aquí las constantes de shared/api.

const invoke = (channel: string, ...args: unknown[]) => ipcRenderer.invoke(channel, ...args);

function subscribe<T>(channel: string, cb: (payload: T) => void): () => void {
    const listener = (_event: IpcRendererEvent, payload: T) => cb(payload);
    ipcRenderer.on(channel, listener);
    return () => {
        ipcRenderer.removeListener(channel, listener);
    };
}

const api: ArgomAPI = {
    isElectron: true,
    platform: process.platform,
    auth: {
        status: () => invoke(IPC.authStatus),
        setup: (username, password) => invoke(IPC.authSetup, username, password),
        login: (password, remember) => invoke(IPC.authLogin, password, remember),
        logout: () => invoke(IPC.authLogout),
        changePassword: (current, next) => invoke(IPC.authChangePassword, current, next),
    },
    telegram: {
        getConfig: () => invoke(IPC.tgGetConfig),
        saveConfig: input => invoke(IPC.tgSaveConfig, input),
        getStatus: () => invoke(IPC.tgGetStatus),
        connect: () => invoke(IPC.tgConnect),
        disconnect: () => invoke(IPC.tgDisconnect),
        submitCode: code => invoke(IPC.tgSubmitCode, code),
        submitPassword: password => invoke(IPC.tgSubmitPassword, password),
        forgetSession: () => invoke(IPC.tgForgetSession),
        getMessages: query => invoke(IPC.tgGetMessages, query),
        clearMessages: () => invoke(IPC.tgClearMessages),
        onStatus: cb => subscribe(IPC.tgStatusEvent, cb),
        onMessage: cb => subscribe(IPC.tgMessageEvent, cb),
    },
};

contextBridge.exposeInMainWorld('argom', api);
