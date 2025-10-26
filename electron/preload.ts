import { contextBridge, ipcRenderer } from 'electron';

// Exponer API segura al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,

  // Métodos para comunicación con el main process
  downloadFile: (url: string, filename: string) => {
    return ipcRenderer.invoke('download-file', { url, filename });
  },

  onDownloadProgress: (callback: (progress: number) => void) => {
    ipcRenderer.on('download-progress', (_, progress) => callback(progress));
  },

  onDownloadComplete: (callback: (filepath: string) => void) => {
    ipcRenderer.on('download-complete', (_, filepath) => callback(filepath));
  },

  onDownloadError: (callback: (error: string) => void) => {
    ipcRenderer.on('download-error', (_, error) => callback(error));
  },

  // Telegram Scraper methods
  startTelegramScraper: (config: any) => {
    return ipcRenderer.invoke('start-telegram-scraper', config);
  },

  stopTelegramScraper: () => {
    return ipcRenderer.invoke('stop-telegram-scraper');
  },

  onTelegramMessage: (callback: (message: any) => void) => {
    ipcRenderer.on('telegram-message', (_, message) => callback(message));
  },

  onTelegramLog: (callback: (log: string) => void) => {
    ipcRenderer.on('telegram-log', (_, log) => callback(log));
  },

  onTelegramError: (callback: (error: string) => void) => {
    ipcRenderer.on('telegram-error', (_, error) => callback(error));
  },

  onTelegramDisconnected: (callback: () => void) => {
    ipcRenderer.on('telegram-disconnected', () => callback());
  }
});

// Types para TypeScript
declare global {
  interface Window {
    electronAPI: {
      isElectron: boolean;
      platform: string;
      downloadFile: (url: string, filename: string) => Promise<string>;
      onDownloadProgress: (callback: (progress: number) => void) => void;
      onDownloadComplete: (callback: (filepath: string) => void) => void;
      onDownloadError: (callback: (error: string) => void) => void;
      startTelegramScraper: (config: any) => Promise<{ success: boolean; message?: string; error?: string }>;
      stopTelegramScraper: () => Promise<{ success: boolean; message?: string; error?: string }>;
      onTelegramMessage: (callback: (message: any) => void) => void;
      onTelegramLog: (callback: (log: string) => void) => void;
      onTelegramError: (callback: (error: string) => void) => void;
      onTelegramDisconnected: (callback: () => void) => void;
    };
  }
}