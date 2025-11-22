export interface ElectronAPI {
  startTelegramScraper: (config: any) => Promise<{ success: boolean; error?: string }>;
  stopTelegramScraper: () => Promise<{ success: boolean; error?: string }>;
  onTelegramMessage: (callback: (message: any) => void) => void;
  onTelegramLog: (callback: (log: string) => void) => void;
  onTelegramError: (callback: (error: string) => void) => void;
  onTelegramDisconnected: (callback: () => void) => void;
  removeTelegramMessageListener: (callback: (message: any) => void) => void;
  removeTelegramLogListener: (callback: (log: string) => void) => void;
  removeTelegramErrorListener: (callback: (error: string) => void) => void;
  removeTelegramDisconnectedListener: (callback: () => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};