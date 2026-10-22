/// <reference types="vitest/config" />
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';

// El proceso main y el preload se emiten como CommonJS (package.json no es
// "type": "module"): el preload con sandbox no admite ESM.
const electronBuild = (entry: string, external: (string | RegExp)[] = []) => ({
    entry,
    vite: {
        build: {
            outDir: 'dist-electron',
            emptyOutDir: false,
            minify: false,
            rollupOptions: {
                external: ['electron', ...external, /^node:/],
            },
        },
    },
});

// Solo en producción: en desarrollo Vite necesita scripts inline para el hot reload.
const CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'";
const contentSecurityPolicy = (): Plugin => ({
    name: 'argom-csp',
    apply: 'build',
    transformIndexHtml: () => [{ tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head-prepend' }],
});

export default defineConfig(() => {
    const isElectron = process.env.ELECTRON === 'true';

    return {
        server: {
            port: 5173,
        },
        plugins: [
            react(),
            contentSecurityPolicy(),
            ...(isElectron
                ? [
                      electron([
                          {
                              ...electronBuild('electron/main.ts', ['telegram', /^telegram\//]),
                              onstart({ startup }) {
                                  void startup();
                              },
                          },
                          {
                              ...electronBuild('electron/preload.ts'),
                              onstart({ reload }) {
                                  reload();
                              },
                          },
                      ]),
                  ]
                : []),
        ],
        base: './', // Rutas relativas: en producción se carga con file://
        build: {
            outDir: 'dist',
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            },
        },
        test: {
            include: ['electron/**/*.test.ts'],
            environment: 'node',
        },
    };
});
