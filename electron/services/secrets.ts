/**
 * Cifra valores sensibles (api_hash, sesión de Telegram) antes de guardarlos.
 * En Electron se usa safeStorage, que delega en el llavero del sistema
 * (DPAPI en Windows, Keychain en macOS, libsecret en Linux).
 */
export interface SecretBox {
    seal(plain: string): string;
    open(sealed: string): string;
}

interface SafeStorageLike {
    isEncryptionAvailable(): boolean;
    encryptString(plain: string): Buffer;
    decryptString(encrypted: Buffer): string;
}

const ENC = 'enc:';
const PLAIN = 'plain:';

export function createSecretBox(safeStorage: SafeStorageLike, onFallback?: () => void): SecretBox {
    return {
        seal(plain) {
            if (safeStorage.isEncryptionAvailable()) {
                return ENC + safeStorage.encryptString(plain).toString('base64');
            }
            // Sin llavero disponible (p. ej. Linux sin libsecret) guardamos en
            // claro antes que perder la configuración, y lo avisamos.
            onFallback?.();
            return PLAIN + plain;
        },
        open(sealed) {
            if (sealed.startsWith(ENC)) {
                return safeStorage.decryptString(Buffer.from(sealed.slice(ENC.length), 'base64'));
            }
            if (sealed.startsWith(PLAIN)) {
                return sealed.slice(PLAIN.length);
            }
            throw new Error('Formato de secreto desconocido');
        },
    };
}
