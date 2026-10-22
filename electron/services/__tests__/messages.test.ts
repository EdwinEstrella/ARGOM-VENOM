import { describe, expect, it } from 'vitest';
import { openDatabase } from '../database';
import { MessageStore } from '../telegram/messages';
import { memoryDb } from './helpers';

const base = { chatId: '1', chatName: 'Alfa', senderName: '@ana', text: 'hola', keywords: ['hola'], tags: [] };

describe('MessageStore', () => {
    it('guarda y devuelve los mensajes, del más reciente al más antiguo', () => {
        const store = new MessageStore(memoryDb().db);
        store.insert({ ...base, sentAt: '2026-10-01T10:00:00.000Z' });
        store.insert({ ...base, chatName: 'Beta', tags: ['token'], sentAt: '2026-10-02T10:00:00.000Z' });

        const all = store.list();
        expect(all.map(m => m.chatName)).toEqual(['Beta', 'Alfa']);
        expect(all[0].tags).toEqual(['token']);
        expect(store.list({ chatName: 'Alfa' })).toHaveLength(1);
        expect(store.list({ limit: 1 })).toHaveLength(1);
    });

    it('acota el límite pedido', () => {
        const store = new MessageStore(memoryDb().db);
        store.insert({ ...base, sentAt: '2026-10-01T10:00:00.000Z' });
        expect(store.list({ limit: -5 })).toHaveLength(1);
        expect(store.list({ limit: 1e9 })).toHaveLength(1);
    });

    it('borra los mensajes de más de 14 días', () => {
        const store = new MessageStore(memoryDb().db);
        store.insert({ ...base, text: 'viejo', sentAt: '2026-10-01T00:00:00.000Z' });
        store.insert({ ...base, text: 'nuevo', sentAt: '2026-10-20T00:00:00.000Z' });

        expect(store.prune(new Date('2026-10-21T00:00:00.000Z'))).toBe(1);
        expect(store.list().map(m => m.text)).toEqual(['nuevo']);
    });

    it('las migraciones se aplican una sola vez', () => {
        const db = openDatabase(':memory:');
        expect(db.prepare('PRAGMA user_version').get()).toEqual({ user_version: 1 });
    });
});
