import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isElectron = process.env.ELECTRON === 'true';

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        ...(isElectron
          ? [
              electron([
                {
                  entry: 'electron/main.ts',
                  onstart(options) {
                    options.startup();
                  },
                  vite: {
                    build: {
                      outDir: 'dist-electron',
                      rollupOptions: {
                        external: ['electron'],
                      },
                    },
                  },
                },
                {
                  entry: 'electron/preload.ts',
                  onstart(options) {
                    options.reload();
                  },
                  vite: {
                    build: {
                      outDir: 'dist-electron',
                    },
                  },
                },
              ]),
            ]
          : []),
      ],
        base: './', // Importante para que funcione en Electron
      build: {
        outDir: 'dist',
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
