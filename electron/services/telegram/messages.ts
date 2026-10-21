import type { MessageQuery, MessageTag, TelegramMessage } from '../../../shared/api';
import type { Database } from '../database';

const RETENTION_DAYS = 14;
const MAX_LIMIT = 500;

interface Row {
    id: number;
    chat_id: string;
    chat_name: string;
    sender_name: string | null;
    text: string;
    keywords: string;
    tags: string;
    sent_at: string;
}

export type NewMessage = Omit<TelegramMessage, 'id'>;

const toMessage = (row: Row): TelegramMessage => ({
    id: row.id,
    chatId: row.chat_id,
    chatName: row.chat_name,
    senderName: row.sender_name,
    text: row.text,
    keywords: JSON.parse(row.keywords) as string[],
    tags: JSON.parse(row.tags) as MessageTag[],
    sentAt: row.sent_at,
});

export class MessageStore {
    constructor(private readonly db: Database) {}

    insert(msg: NewMessage): TelegramMessage {
        const result = this.db
            .prepare(
                `INSERT INTO telegram_messages (chat_id, chat_name, sender_name, text, keywords, tags, sent_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
            )
            .run(msg.chatId, msg.chatName, msg.senderName, msg.text, JSON.stringify(msg.keywords), JSON.stringify(msg.tags), msg.sentAt);
        return { ...msg, id: Number(result.lastInsertRowid) };
    }

    list(query: MessageQuery = {}): TelegramMessage[] {
        const limit = Math.min(Math.max(Math.trunc(query.limit ?? 100), 1), MAX_LIMIT);
        const rows = query.chatName
            ? this.db
                  .prepare('SELECT * FROM telegram_messages WHERE chat_name = ? ORDER BY sent_at DESC, id DESC LIMIT ?')
                  .all(query.chatName, limit)
            : this.db.prepare('SELECT * FROM telegram_messages ORDER BY sent_at DESC, id DESC LIMIT ?').all(limit);
        return (rows as unknown as Row[]).map(toMessage);
    }

    clear(): void {
        this.db.exec('DELETE FROM telegram_messages');
    }

    /** Borra los mensajes con más de RETENTION_DAYS días. Devuelve cuántos se borraron. */
    prune(now: Date = new Date()): number {
        const cutoff = new Date(now.getTime() - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
        const result = this.db.prepare('DELETE FROM telegram_messages WHERE sent_at < ?').run(cutoff);
        return Number(result.changes);
    }
}
