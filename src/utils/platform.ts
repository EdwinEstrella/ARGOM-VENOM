// Declaración de tipos para window.electron
declare global {
  interface Window {
    electron?: {
      isElectron: boolean;
      platform: string;
    };
  }
}

export const isElectron = (): boolean => {
  return !!(window.electron && window.electron.isElectron);
};

export const isWeb = (): boolean => {
  return !isElectron();
};

export const getPlatform = (): string => {
  if (isElectron() && window.electron) {
    return window.electron.platform;
  }
  return 'web';
};