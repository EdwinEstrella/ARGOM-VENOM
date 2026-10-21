import React, { useCallback, useEffect, useState } from 'react';
import { Card } from './Card';
import { Switch } from './Switch';
import { api, isElectron } from '../src/api';
import { useLanguage } from '../contexts/LanguageContext';
import type { MessageTag, TelegramConfig, TelegramConfigInput, TelegramMessage, TelegramStatusEvent } from '../shared/api';

const MAX_FEED = 200;

const inputClass =
    'form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 placeholder:text-[#9d9db8] px-4 text-base font-normal leading-normal';
const primaryButton =
    'flex min-w-[84px] cursor-pointer items-center justify-center gap-2 rounded-lg h-12 px-4 bg-primary text-background-dark text-base font-bold hover:bg-primary/90 disabled:bg-[#3c3c53] disabled:cursor-not-allowed transition-colors';

const TAG_LABELS: Record<MessageTag, string> = {
    dexscreener: 'DexScreener',
    pumpfun: 'pump.fun',
    twitter: 'X / Twitter',
    solana: 'Solana',
    token: 'Token',
};

const translations = {
    en: {
        connection: 'Telegram Connection',
        status: {
            disconnected: 'Disconnected',
            connecting: 'Connecting...',
            awaiting_code: 'Waiting for login code',
            awaiting_password: 'Waiting for 2FA password',
            connected: 'Connected',
            error: 'Connection error',
        },
        connect: 'Connect to Telegram',
        disconnect: 'Disconnect',
        autoConnect: 'Connect automatically on startup',
        forget: 'Forget Telegram session',
        codePrompt: 'Telegram sent you a login code (check the Telegram app).',
        passwordPrompt: 'Your account has two-step verification enabled.',
        hint: 'Hint',
        send: 'Send',
        apiTitle: 'API Configuration',
        apiHelp: 'Get your API ID and API Hash at',
        apiHashSaved: 'Saved — leave empty to keep it',
        phone: 'Phone number',
        save: 'Save',
        saved: 'Saved',
        groups: 'Groups to Monitor',
        groupsHelp: 'Group title or @username. Leave empty to listen to every chat.',
        keywords: 'Keywords to Track',
        keywordsHelp: 'Leave empty to save every message.',
        add: 'Add',
        remove: 'Remove',
        feed: 'Messages Feed',
        feedHelp: 'Messages from the last 14 days',
        clear: 'Clear',
        empty: 'No messages yet',
        desktopOnly: 'The Telegram scraper only works in the desktop app.',
    },
    es: {
        connection: 'Conexión con Telegram',
        status: {
            disconnected: 'Desconectado',
            connecting: 'Conectando...',
            awaiting_code: 'Esperando el código de acceso',
            awaiting_password: 'Esperando la contraseña 2FA',
            connected: 'Conectado',
            error: 'Error de conexión',
        },
        connect: 'Conectar con Telegram',
        disconnect: 'Desconectar',
        autoConnect: 'Conectar automáticamente al abrir la app',
        forget: 'Olvidar sesión de Telegram',
        codePrompt: 'Telegram te ha enviado un código de acceso (revisa la app de Telegram).',
        passwordPrompt: 'Tu cuenta tiene verificación en dos pasos.',
        hint: 'Pista',
        send: 'Enviar',
        apiTitle: 'Configuración de la API',
        apiHelp: 'Consigue tu API ID y API Hash en',
        apiHashSaved: 'Guardado — déjalo vacío para conservarlo',
        phone: 'Teléfono',
        save: 'Guardar',
        saved: 'Guardado',
        groups: 'Grupos a monitorear',
        groupsHelp: 'Título del grupo o @usuario. Vacío = escuchar todos los chats.',
        keywords: 'Palabras clave',
        keywordsHelp: 'Vacío = guardar todos los mensajes.',
        add: 'Añadir',
        remove: 'Quitar',
        feed: 'Mensajes',
        feedHelp: 'Mensajes de los últimos 14 días',
        clear: 'Borrar',
        empty: 'Todavía no hay mensajes',
        desktopOnly: 'El scraper de Telegram solo funciona en la app de escritorio.',
    },
};

const STATUS_COLOR: Record<TelegramStatusEvent['status'], string> = {
    disconnected: 'text-gray-500',
    connecting: 'text-yellow-500',
    awaiting_code: 'text-yellow-500',
    awaiting_password: 'text-yellow-500',
    connected: 'text-green-500',
    error: 'text-red-500',
};

const toInput = (config: TelegramConfig): TelegramConfigInput => ({
    apiId: config.apiId,
    phone: config.phone,
    groups: config.groups,
    keywords: config.keywords,
    autoConnect: config.autoConnect,
});

const ListEditor: React.FC<{
    title: string;
    help: string;
    placeholder: string;
    items: string[];
    addLabel: string;
    removeLabel: string;
    onChange: (items: string[]) => void;
}> = ({ title, help, placeholder, items, addLabel, removeLabel, onChange }) => {
    const [value, setValue] = useState('');
    const add = () => {
        const v = value.trim();
        if (v && !items.includes(v)) {
            onChange([...items, v]);
        }
        setValue('');
    };
    return (
        <Card title={title}>
            <p className="text-[#A0A0A0] text-sm">{help}</p>
            <div className="flex gap-2">
                <input
                    className={inputClass}
                    placeholder={placeholder}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && add()}
                />
                <button onClick={add} className={primaryButton}>
                    {addLabel}
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {items.map(item => (
                    <span key={item} className="flex items-center gap-2 bg-[#2A2A2E] px-3 py-1.5 rounded-full border border-[#292938] text-sm text-[#EAEAEA]">
                        {item}
                        <button
                            onClick={() => onChange(items.filter(i => i !== item))}
                            className="text-red-400 hover:text-red-300"
                            title={removeLabel}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
        </Card>
    );
};

export const TelegramScraper: React.FC = () => {
    const { isEnglish } = useLanguage();
    const t = isEnglish ? translations.en : translations.es;

    const [config, setConfig] = useState<TelegramConfig | null>(null);
    const [draft, setDraft] = useState<TelegramConfigInput | null>(null);
    const [apiHash, setApiHash] = useState('');
    const [status, setStatus] = useState<TelegramStatusEvent>({ status: 'disconnected' });
    const [messages, setMessages] = useState<TelegramMessage[]>([]);
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [notice, setNotice] = useState<{ kind: 'error' | 'ok'; text: string } | null>(null);
    const [busy, setBusy] = useState(false);

    const applyConfig = (next: TelegramConfig) => {
        setConfig(next);
        setDraft(toInput(next));
    };

    useEffect(() => {
        void api.telegram.getConfig().then(r => r.ok && applyConfig(r.data));
        void api.telegram.getStatus().then(r => r.ok && setStatus(r.data));
        void api.telegram.getMessages({ limit: MAX_FEED }).then(r => r.ok && setMessages(r.data));

        const offStatus = api.telegram.onStatus(setStatus);
        const offMessage = api.telegram.onMessage(m => setMessages(prev => [m, ...prev].slice(0, MAX_FEED)));
        return () => {
            offStatus();
            offMessage();
        };
    }, []);

    const run = useCallback(async (action: () => Promise<{ ok: boolean; error?: string }>, okText?: string) => {
        setBusy(true);
        setNotice(null);
        try {
            const r = await action();
            if (!r.ok) {
                setNotice({ kind: 'error', text: r.error ?? 'Error' });
            } else if (okText) {
                setNotice({ kind: 'ok', text: okText });
            }
            return r.ok;
        } finally {
            setBusy(false);
        }
    }, []);

    const save = async (input: TelegramConfigInput, okText?: string) => {
        setBusy(true);
        setNotice(null);
        try {
            const r = await api.telegram.saveConfig({ ...input, apiHash: apiHash || undefined });
            if (r.ok) {
                applyConfig(r.data);
                setApiHash('');
                if (okText) setNotice({ kind: 'ok', text: okText });
            } else {
                setNotice({ kind: 'error', text: r.error });
            }
            return r.ok;
        } finally {
            setBusy(false);
        }
    };

    /** Guarda solo un campo (listas, autoconexión) sin tocar lo que se esté editando en el formulario. */
    const savePartial = async (patch: Partial<TelegramConfigInput>) => {
        if (!config) return;
        setNotice(null);
        const r = await api.telegram.saveConfig({ ...toInput(config), ...patch });
        if (r.ok) {
            setConfig(r.data);
            setDraft(d => (d ? { ...d, ...patch } : d));
        } else {
            setNotice({ kind: 'error', text: r.error });
        }
    };

    if (!isElectron()) {
        return (
            <Card title={t.connection}>
                <p className="text-[#A0A0A0]">{t.desktopOnly}</p>
            </Card>
        );
    }

    if (!config || !draft) {
        return null;
    }

    const isActive = status.status !== 'disconnected' && status.status !== 'error';

    return (
        <div className="space-y-6">
            <Card title={t.connection}>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <p className="text-[#EAEAEA] text-base font-medium">{t.status[status.status]}</p>
                        <p className={`text-sm ${STATUS_COLOR[status.status]}`}>● {config.phone || '—'}</p>
                    </div>
                    <label className="flex items-center gap-2">
                        <Switch
                            checked={draft.autoConnect}
                            onChange={checked => void savePartial({ autoConnect: checked })}
                        />
                        <span className="text-[#EAEAEA] text-sm">{t.autoConnect}</span>
                    </label>
                </div>

                {(status.error || notice) && (
                    <div
                        className={`rounded-lg p-3 text-sm border ${
                            notice?.kind === 'ok' && !status.error
                                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}
                        role="alert"
                    >
                        {status.error ?? notice?.text}
                    </div>
                )}

                {status.status === 'awaiting_code' && (
                    <form
                        className="flex flex-col gap-2"
                        onSubmit={e => {
                            e.preventDefault();
                            void run(() => api.telegram.submitCode(code)).then(ok => ok && setCode(''));
                        }}
                    >
                        <p className="text-[#EAEAEA] text-sm">{t.codePrompt}</p>
                        <div className="flex gap-2">
                            <input className={inputClass} inputMode="numeric" autoFocus value={code} onChange={e => setCode(e.target.value)} />
                            <button className={primaryButton} disabled={!code || busy}>
                                {t.send}
                            </button>
                        </div>
                    </form>
                )}

                {status.status === 'awaiting_password' && (
                    <form
                        className="flex flex-col gap-2"
                        onSubmit={e => {
                            e.preventDefault();
                            void run(() => api.telegram.submitPassword(password)).then(ok => ok && setPassword(''));
                        }}
                    >
                        <p className="text-[#EAEAEA] text-sm">
                            {t.passwordPrompt}
                            {status.passwordHint && ` ${t.hint}: ${status.passwordHint}`}
                        </p>
                        <div className="flex gap-2">
                            <input className={inputClass} type="password" autoFocus value={password} onChange={e => setPassword(e.target.value)} />
                            <button className={primaryButton} disabled={!password || busy}>
                                {t.send}
                            </button>
                        </div>
                    </form>
                )}

                <div className="flex gap-2 flex-wrap">
                    {isActive ? (
                        <button
                            onClick={() => void run(() => api.telegram.disconnect())}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            {t.disconnect}
                        </button>
                    ) : (
                        <button
                            onClick={() => void run(() => api.telegram.connect())}
                            disabled={busy || !config.hasApiHash || !config.apiId || !config.phone}
                            className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-[#3c3c53] text-background-dark font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
                        >
                            {t.connect}
                        </button>
                    )}
                    {config.hasSession && (
                        <button
                            onClick={() =>
                                void run(() => api.telegram.forgetSession()).then(
                                    ok => ok && api.telegram.getConfig().then(r => r.ok && applyConfig(r.data)),
                                )
                            }
                            className="py-2 px-4 rounded-lg border border-[#3c3c53] text-[#A0A0A0] hover:text-white text-sm"
                        >
                            {t.forget}
                        </button>
                    )}
                </div>
            </Card>

            <Card title={t.apiTitle}>
                <p className="text-[#A0A0A0] text-sm">
                    {t.apiHelp}{' '}
                    <a href="https://my.telegram.org/apps" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        my.telegram.org/apps
                    </a>
                </p>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={e => {
                        e.preventDefault();
                        void save(draft, t.saved);
                    }}
                >
                    <label className="flex flex-col">
                        <p className="text-[#EAEAEA] text-base font-medium pb-2">API ID</p>
                        <input className={inputClass} inputMode="numeric" value={draft.apiId} onChange={e => setDraft({ ...draft, apiId: e.target.value })} />
                    </label>
                    <label className="flex flex-col">
                        <p className="text-[#EAEAEA] text-base font-medium pb-2">API Hash</p>
                        <input
                            className={inputClass}
                            type="password"
                            autoComplete="off"
                            placeholder={config.hasApiHash ? t.apiHashSaved : ''}
                            value={apiHash}
                            onChange={e => setApiHash(e.target.value)}
                        />
                    </label>
                    <label className="flex flex-col">
                        <p className="text-[#EAEAEA] text-base font-medium pb-2">{t.phone}</p>
                        <input
                            className={inputClass}
                            type="tel"
                            placeholder="+34600111222"
                            value={draft.phone}
                            onChange={e => setDraft({ ...draft, phone: e.target.value })}
                        />
                    </label>
                    <button className={primaryButton} disabled={busy}>
                        {t.save}
                    </button>
                </form>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                <ListEditor
                    title={t.groups}
                    help={t.groupsHelp}
                    placeholder="CryptoGroup / @channel"
                    items={draft.groups}
                    addLabel={t.add}
                    removeLabel={t.remove}
                    onChange={groups => void savePartial({ groups })}
                />
                <ListEditor
                    title={t.keywords}
                    help={t.keywordsHelp}
                    placeholder="pump.fun"
                    items={draft.keywords}
                    addLabel={t.add}
                    removeLabel={t.remove}
                    onChange={keywords => void savePartial({ keywords })}
                />
            </div>

            <Card title={t.feed}>
                <div className="flex justify-between items-center">
                    <p className="text-[#A0A0A0] text-sm">{t.feedHelp}</p>
                    <button
                        onClick={() => void run(() => api.telegram.clearMessages()).then(ok => ok && setMessages([]))}
                        className="text-primary hover:text-primary/80 text-sm font-medium"
                    >
                        {t.clear}
                    </button>
                </div>
                <div className="flex flex-col gap-2 max-h-[32rem] overflow-y-auto">
                    {messages.length === 0 ? (
                        <p className="text-[#A0A0A0] text-center py-8">{t.empty}</p>
                    ) : (
                        messages.map(m => (
                            <div key={m.id} className="bg-[#2A2A2E] p-3 rounded-lg border border-[#292938] space-y-2">
                                <div className="flex justify-between items-start gap-2">
                                    <span className="text-primary text-sm font-medium">
                                        {m.chatName}
                                        {m.senderName && <span className="text-[#A0A0A0] font-normal"> · {m.senderName}</span>}
                                    </span>
                                    <span className="text-[#A0A0A0] text-xs whitespace-nowrap">{new Date(m.sentAt).toLocaleString()}</span>
                                </div>
                                <p className="text-[#EAEAEA] text-sm leading-relaxed whitespace-pre-wrap break-words">{m.text}</p>
                                {(m.tags.length > 0 || m.keywords.length > 0) && (
                                    <div className="flex flex-wrap gap-1">
                                        {m.tags.map(tag => (
                                            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                                                {TAG_LABELS[tag]}
                                            </span>
                                        ))}
                                        {m.keywords.map(k => (
                                            <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-[#EAEAEA]">
                                                {k}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
};
