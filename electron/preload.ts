import { contextBridge } from 'electron';

// Exponer APIs seguras al renderer process
contextBridge.exposeInMainWorld('electron', {
  isElectron: true,
  platform: process.platform,
  // Aquí puedes agregar más APIs si necesitas comunicación con el proceso principal
});