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
    };
  }
}