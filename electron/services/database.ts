import { DatabaseSync } from 'node:sqlite';

// Cada migración se aplica una sola vez, en orden. Para cambiar el esquema,
// añade una nueva entrada al final; nunca edites una ya publicada.
const MIGRATIONS: string[] = [
    `
    CREATE TABLE settings (
        key   TEXT PRIMARY KEY,
        value TEXT NOT NULL
    );
    CREATE TABLE telegram_messages (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id     TEXT NOT NULL,
        chat_name   TEXT NOT NULL,
        sender_name TEXT,
        text        TEXT NOT NULL,
        keywords    TEXT NOT NULL DEFAULT '[]',
        tags        TEXT NOT NULL DEFAULT '[]',
        sent_at     TEXT NOT NULL,
        created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
    CREATE INDEX idx_tg_messages_sent_at ON telegram_messages(sent_at);
    CREATE INDEX idx_tg_messages_chat ON telegram_messages(chat_name);
    `,
];

export type Database = DatabaseSync;

export function openDatabase(path: string): Database {
    const db = new DatabaseSync(path);
    db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
    migrate(db);
    return db;
}

function migrate(db: Database): void {
    const { user_version: current } = db.prepare('PRAGMA user_version').get() as { user_version: number };
    for (let version = current; version < MIGRATIONS.length; version++) {
        db.exec('BEGIN');
        try {
            db.exec(MIGRATIONS[version]);
            db.exec(`PRAGMA user_version = ${version + 1}`);
            db.exec('COMMIT');
        } catch (err) {
            db.exec('ROLLBACK');
            throw err;
        }
    }
}

/** Almacén clave/valor (JSON) sobre la tabla settings. */
export class Settings {
    constructor(private readonly db: Database) {}

    get<T>(key: string): T | undefined {
        const row = this.db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
        return row ? (JSON.parse(row.value) as T) : undefined;
    }

    set(key: string, value: unknown): void {
        this.db
            .prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
            .run(key, JSON.stringify(value));
    }

    delete(key: string): void {
        this.db.prepare('DELETE FROM settings WHERE key = ?').run(key);
    }
}
