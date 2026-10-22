import { openDatabase, Settings, type Database } from '../database';
import type { SecretBox } from '../secrets';

export function memoryDb(): { db: Database; settings: Settings } {
    const db = openDatabase(':memory:');
    return { db, settings: new Settings(db) };
}

/** "Cifrado" reversible y visible, para comprobar que se usa el SecretBox. */
export const fakeSecrets: SecretBox = {
    seal: plain => `sealed(${plain})`,
    open: sealed => sealed.replace(/^sealed\((.*)\)$/, '$1'),
};
