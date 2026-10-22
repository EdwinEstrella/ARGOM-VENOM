import { describe, expect, it } from 'vitest';
import { AuthError, AuthService } from '../auth';
import { memoryDb } from './helpers';

describe('AuthService', () => {
    it('pide configuración en el primer arranque y deja entrar tras crear la cuenta', () => {
        const { settings } = memoryDb();
        const auth = new AuthService(settings);
        expect(auth.status()).toEqual({ configured: false, authenticated: false, username: null });

        expect(auth.setup('  Edwin ', 'supersecreta')).toEqual({ configured: true, authenticated: true, username: 'Edwin' });
        expect(() => auth.setup('Otro', 'supersecreta')).toThrow(AuthError);
    });

    it('no guarda la contraseña en claro', () => {
        const { db, settings } = memoryDb();
        new AuthService(settings).setup('Edwin', 'supersecreta');
        const raw = db.prepare('SELECT value FROM settings').all() as { value: string }[];
        expect(JSON.stringify(raw)).not.toContain('supersecreta');
    });

    it('rechaza contraseñas cortas', () => {
        const { settings } = memoryDb();
        expect(() => new AuthService(settings).setup('Edwin', 'corta')).toThrow(/al menos 8/);
    });

    it('valida la contraseña al iniciar sesión', () => {
        const { settings } = memoryDb();
        new AuthService(settings).setup('Edwin', 'supersecreta');

        const auth = new AuthService(settings);
        expect(auth.isAuthenticated()).toBe(false);
        expect(() => auth.login('incorrecta', false)).toThrow('Contraseña incorrecta');
        expect(auth.login('supersecreta', false).authenticated).toBe(true);
    });

    it('bloquea temporalmente tras 5 fallos', () => {
        const { settings } = memoryDb();
        let now = 1_000_000;
        new AuthService(settings).setup('Edwin', 'supersecreta');
        const auth = new AuthService(settings, () => now);

        for (let i = 0; i < 5; i++) {
            expect(() => auth.login('mal', false)).toThrow('Contraseña incorrecta');
        }
        expect(() => auth.login('supersecreta', false)).toThrow(/Demasiados intentos/);
        now += 31_000;
        expect(auth.login('supersecreta', false).authenticated).toBe(true);
    });

    it('"recordar" mantiene la sesión entre reinicios durante 7 días', () => {
        const { settings } = memoryDb();
        let now = 1_000_000;
        new AuthService(settings).setup('Edwin', 'supersecreta');
        new AuthService(settings, () => now).login('supersecreta', true);

        expect(new AuthService(settings, () => now).isAuthenticated()).toBe(true);
        now += 8 * 24 * 60 * 60 * 1000;
        expect(new AuthService(settings, () => now).isAuthenticated()).toBe(false);
    });

    it('cerrar sesión olvida el "recordar"', () => {
        const { settings } = memoryDb();
        new AuthService(settings).setup('Edwin', 'supersecreta');
        const auth = new AuthService(settings);
        auth.login('supersecreta', true);
        auth.logout();
        expect(new AuthService(settings).isAuthenticated()).toBe(false);
    });

    it('cambia la contraseña solo si la actual es correcta', () => {
        const { settings } = memoryDb();
        const auth = new AuthService(settings);
        auth.setup('Edwin', 'supersecreta');
        expect(() => auth.changePassword('mal', 'nuevaclave1')).toThrow(/actual/);
        auth.changePassword('supersecreta', 'nuevaclave1');

        const fresh = new AuthService(settings);
        expect(() => fresh.login('supersecreta', false)).toThrow();
        expect(fresh.login('nuevaclave1', false).authenticated).toBe(true);
    });
});
