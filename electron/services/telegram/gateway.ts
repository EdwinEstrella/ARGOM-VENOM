import { Api, TelegramClient } from 'telegram';
import { NewMessage, type NewMessageEvent } from 'telegram/events';
import { LogLevel } from 'telegram/extensions/Logger';
import { StringSession } from 'telegram/sessions';

export interface RawMessage {
    chatId: string;
    chatTitle: string | null;
    chatUsername: string | null;
    senderName: string | null;
    text: string;
    date: Date;
}

export interface ConnectOptions {
    apiId: number;
    apiHash: string;
    phone: string;
    session: string;
}

export interface AuthPrompts {
    phoneCode(): Promise<string>;
    password(hint?: string): Promise<string>;
    /** Devuelve true para abortar el login, false para volver a preguntar. */
    onError(err: Error): boolean;
}

/** Lo mínimo que el servicio necesita de un cliente de Telegram (permite tests sin red). */
export interface TelegramGateway {
    /** Inicia sesión y devuelve la sesión serializada para reutilizarla. */
    connect(opts: ConnectOptions, prompts: AuthPrompts): Promise<string>;
    onMessage(cb: (msg: RawMessage) => void): void;
    disconnect(): Promise<void>;
}

function describeChat(chat: Api.TypeChat | Api.TypeUser | undefined): { title: string | null; username: string | null } {
    if (!chat) {
        return { title: null, username: null };
    }
    if (chat instanceof Api.User) {
        const name = [chat.firstName, chat.lastName].filter(Boolean).join(' ');
        return { title: name || null, username: chat.username ?? null };
    }
    const title = 'title' in chat ? chat.title : null;
    const username = chat instanceof Api.Channel ? (chat.username ?? null) : null;
    return { title, username };
}

export function createGramJsGateway(): TelegramGateway {
    let client: TelegramClient | null = null;

    return {
        async connect(opts, prompts) {
            client = new TelegramClient(new StringSession(opts.session), opts.apiId, opts.apiHash, {
                connectionRetries: 5,
                deviceModel: 'ARGOM VENOM',
                appVersion: '2.0',
            });
            client.setLogLevel(LogLevel.ERROR);
            await client.start({
                phoneNumber: opts.phone,
                phoneCode: () => prompts.phoneCode(),
                password: hint => prompts.password(hint),
                onError: async err => prompts.onError(err),
            });
            return (client.session as StringSession).save();
        },

        onMessage(cb) {
            client?.addEventHandler(async (event: NewMessageEvent) => {
                const message = event.message;
                const text = message.message ?? '';
                if (!text) {
                    return;
                }
                const [chat, sender] = await Promise.all([
                    message.getChat().catch(() => undefined),
                    message.getSender().catch(() => undefined),
                ]);
                const { title, username } = describeChat(chat);
                const senderInfo = describeChat(sender);
                cb({
                    chatId: String(message.chatId ?? ''),
                    chatTitle: title,
                    chatUsername: username,
                    senderName: senderInfo.username ? `@${senderInfo.username}` : senderInfo.title,
                    text,
                    date: new Date(message.date * 1000),
                });
            }, new NewMessage({}));
        },

        async disconnect() {
            const current = client;
            client = null;
            // destroy() (a diferencia de disconnect()) también para el bucle de actualizaciones.
            await current?.destroy();
        },
    };
}
