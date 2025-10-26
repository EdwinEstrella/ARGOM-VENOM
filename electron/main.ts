import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';

// Desactiva el modo sandbox para mejor compatibilidad
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

// Establecer el icono de la aplicación
if (process.platform === 'win32') {
  app.setAppUserModelId('com.argom.venom');
}

let mainWindow: BrowserWindow | null = null;
let telegramProcess: ChildProcess | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, '../public/venom.ico'),
    show: false, // No mostrar la ventana hasta que esté lista
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: false, // Para evitar problemas CORS en modo escritorio
    },
    autoHideMenuBar: true, // Oculta el menú en Windows/Linux
  });

  // Mostrar la ventana cuando esté completamente cargada
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Establecer el icono de la ventana para Windows
  if (process.platform === 'win32') {
    const iconPath = path.join(__dirname, '../public/venom.ico');
    if (mainWindow) {
      mainWindow.setIcon(iconPath);
    }
  }

  // En desarrollo, carga desde Vite dev server
  // En producción, carga la URL real de la aplicación
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL('https://argom.ibpau.rest/');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Telegram Scraper IPC handlers
ipcMain.handle('start-telegram-scraper', async (_, config) => {
  try {
    if (telegramProcess) {
      telegramProcess.kill();
    }

    const args = [
      config.apiId,
      config.apiHash,
      config.phone,
      ...config.groups,
      'keywords:',
      ...config.keywords
    ];

    telegramProcess = spawn('python', ['telegram_scraper.py', ...args], {
      cwd: app.getAppPath(),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    telegramProcess.stdout?.on('data', (data) => {
      const output = data.toString();
      const lines = output.split('\n');

      lines.forEach((line: string) => {
        if (line.startsWith('DATA:')) {
          try {
            const messageData = JSON.parse(line.substring(5));
            mainWindow?.webContents.send('telegram-message', messageData);
          } catch (e) {
            console.error('Error parsing Telegram message:', e);
          }
        } else if (line.trim()) {
          console.log('Telegram scraper:', line);
          mainWindow?.webContents.send('telegram-log', line);
        }
      });
    });

    telegramProcess.stderr?.on('data', (data) => {
      console.error('Telegram scraper error:', data.toString());
      mainWindow?.webContents.send('telegram-error', data.toString());
    });

    telegramProcess.on('close', (code) => {
      console.log(`Telegram scraper process exited with code ${code}`);
      mainWindow?.webContents.send('telegram-disconnected');
      telegramProcess = null;
    });

    return { success: true, message: 'Telegram scraper started' };
  } catch (error: any) {
    console.error('Failed to start Telegram scraper:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('stop-telegram-scraper', async () => {
  try {
    if (telegramProcess) {
      telegramProcess.kill();
      telegramProcess = null;
    }
    return { success: true, message: 'Telegram scraper stopped' };
  } catch (error: any) {
    console.error('Failed to stop Telegram scraper:', error);
    return { success: false, error: error.message };
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (telegramProcess) {
    telegramProcess.kill();
  }
});