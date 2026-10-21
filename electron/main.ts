import { app, BrowserWindow, safeStorage, shell, type IpcMainInvokeEvent } from 'electron';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { registerIpc } from './ipc';
import { AuthService } from './services/auth';
import { openDatabase, Settings } from './services/database';
import { createSecretBox } from './services/secrets';
import { createGramJsGateway } from './services/telegram/gateway';
import { MessageStore } from './services/telegram/messages';
import { TelegramService } from './services/telegram/service';

// vite-plugin-electron define esta variable al arrancar con `npm run dev:electron`.
const DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
const RENDERER_DIR = path.join(__dirname, '../dist');
const ICON = path.join(__dirname, DEV_SERVER_URL ? '../public/venom.ico' : '../dist/venom.ico');
const PRUNE_INTERVAL_MS = 24 * 60 * 60 * 1000;

if (process.platform === 'win32') {
    app.setAppUserModelId('com.argom.venom');
}

// Una sola instancia: la base de datos y la sesión de Telegram no se comparten.
const hasLock = app.requestSingleInstanceLock();
if (!hasLock) {
    app.quit();
}

let mainWindow: BrowserWindow | null = null;

function isAppUrl(url: string): boolean {
    if (DEV_SERVER_URL) {
        return url.startsWith(DEV_SERVER_URL);
    }
    return url.startsWith(pathToFileURL(RENDERER_DIR).href);
}

function isTrustedSender(event: IpcMainInvokeEvent): boolean {
    return event.sender === mainWindow?.webContents && isAppUrl(event.senderFrame?.url ?? '');
}

function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        icon: ICON,
        show: false,
        backgroundColor: '#0D0D0F',
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    mainWindow.once('ready-to-show', () => mainWindow?.show());

    // Los enlaces externos se abren en el navegador, nunca dentro de la app.
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (/^https?:\/\//.test(url)) {
            void shell.openExternal(url);
        }
        return { action: 'deny' };
    });
    mainWindow.webContents.on('will-navigate', (event, url) => {
        if (!isAppUrl(url)) {
            event.preventDefault();
        }
    });

    if (DEV_SERVER_URL) {
        void mainWindow.loadURL(DEV_SERVER_URL);
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    } else {
        void mainWindow.loadFile(path.join(RENDERER_DIR, 'index.html'));
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function bootstrap() {
    const db = openDatabase(path.join(app.getPath('userData'), 'argom-venom.db'));
    const settings = new Settings(db);
    const secrets = createSecretBox(safeStorage, () =>
        console.warn('[secrets] El llavero del sistema no está disponible; los secretos se guardan sin cifrar'),
    );
    const messages = new MessageStore(db);
    const auth = new AuthService(settings);
    const telegram = new TelegramService(settings, secrets, messages, createGramJsGateway);

    const autoConnect = () => {
        const config = telegram.getConfig();
        if (config.autoConnect && config.hasSession && telegram.getStatus().status === 'disconnected') {
            telegram.connect().catch(err => console.warn('[telegram] autoconexión fallida:', err.message));
        }
    };

    registerIpc(
        { auth, telegram, messages },
        { isTrustedSender, target: () => mainWindow?.webContents ?? null, onAuthenticated: autoConnect },
    );

    messages.prune();
    setInterval(() => messages.prune(), PRUNE_INTERVAL_MS).unref();

    app.on('before-quit', () => {
        void telegram.disconnect();
        db.close();
    });

    if (auth.isAuthenticated()) {
        autoConnect();
    }
}

app.on('second-instance', () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});

app.whenReady().then(() => {
    if (!hasLock) {
        return;
    }
    bootstrap();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
