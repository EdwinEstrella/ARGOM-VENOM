import { app, BrowserWindow } from 'electron';
import path from 'path';

// Desactiva el modo sandbox para mejor compatibilidad
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, '../../public/venom.ico'),
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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});