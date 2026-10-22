import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { AuthStatus } from '../../shared/api';
import type { Settings } from './database';

interface StoredCredentials {
    username: string;
    salt: string;
    hash: string;
}

const CREDENTIALS_KEY = 'auth.credentials';
const REMEMBER_KEY = 'auth.rememberUntil';
const REMEMBER_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_FAILURES = 5;
const LOCKOUT_MS = 30_000;
const MIN_PASSWORD_LENGTH = 8;

function hashPassword(password: string, salt: Buffer): Buffer {
    return scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
}

export class AuthError extends Error {}

/**
 * Autenticación local de un único usuario. La contraseña se guarda con scrypt
 * y la sesión vive en el proceso main: el renderer nunca ve el hash.
 */
export class AuthService {
    private authenticated = false;
    private failures = 0;
    private lockedUntil = 0;

    constructor(private readonly settings: Settings, private readonly now: () => number = Date.now) {
        const rememberUntil = settings.get<number>(REMEMBER_KEY);
        if (rememberUntil && rememberUntil > this.now() && this.credentials()) {
            this.authenticated = true;
        }
    }

    status(): AuthStatus {
        const creds = this.credentials();
        return {
            configured: Boolean(creds),
            authenticated: this.authenticated,
            username: creds?.username ?? null,
        };
    }

    isAuthenticated(): boolean {
        return this.authenticated;
    }

    setup(username: string, password: string): AuthStatus {
        if (this.credentials()) {
            throw new AuthError('La cuenta ya está configurada');
        }
        const name = username.trim();
        if (!name) {
            throw new AuthError('El nombre de usuario es obligatorio');
        }
        this.storePassword(name, password);
        this.authenticated = true;
        return this.status();
    }

    login(password: string, remember: boolean): AuthStatus {
        const creds = this.credentials();
        if (!creds) {
            throw new AuthError('Primero crea una contraseña');
        }
        const now = this.now();
        if (now < this.lockedUntil) {
            const seconds = Math.ceil((this.lockedUntil - now) / 1000);
            throw new AuthError(`Demasiados intentos. Espera ${seconds} s`);
        }

        const expected = Buffer.from(creds.hash, 'hex');
        const actual = hashPassword(password, Buffer.from(creds.salt, 'hex'));
        if (!timingSafeEqual(expected, actual)) {
            this.failures++;
            if (this.failures >= MAX_FAILURES) {
                this.failures = 0;
                this.lockedUntil = now + LOCKOUT_MS;
            }
            throw new AuthError('Contraseña incorrecta');
        }

        this.failures = 0;
        this.authenticated = true;
        if (remember) {
            this.settings.set(REMEMBER_KEY, now + REMEMBER_MS);
        } else {
            this.settings.delete(REMEMBER_KEY);
        }
        return this.status();
    }

    logout(): AuthStatus {
        this.authenticated = false;
        this.settings.delete(REMEMBER_KEY);
        return this.status();
    }

    changePassword(current: string, next: string): void {
        const creds = this.credentials();
        if (!creds || !this.authenticated) {
            throw new AuthError('No autenticado');
        }
        const actual = hashPassword(current, Buffer.from(creds.salt, 'hex'));
        if (!timingSafeEqual(Buffer.from(creds.hash, 'hex'), actual)) {
            throw new AuthError('La contraseña actual no es correcta');
        }
        this.storePassword(creds.username, next);
    }

    private storePassword(username: string, password: string): void {
        if (password.length < MIN_PASSWORD_LENGTH) {
            throw new AuthError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
        }
        const salt = randomBytes(16);
        const creds: StoredCredentials = {
            username,
            salt: salt.toString('hex'),
            hash: hashPassword(password, salt).toString('hex'),
        };
        this.settings.set(CREDENTIALS_KEY, creds);
    }

    private credentials(): StoredCredentials | undefined {
        return this.settings.get<StoredCredentials>(CREDENTIALS_KEY);
    }
}
