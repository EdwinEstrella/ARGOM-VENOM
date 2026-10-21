import type { MessageTag } from '../../../shared/api';

export interface FilterRules {
    groups: string[];
    keywords: string[];
}

export interface IncomingMessage {
    chatTitle: string | null;
    chatUsername: string | null;
    text: string;
}

export interface FilterMatch {
    keywords: string[];
    tags: MessageTag[];
}

const TAG_PATTERNS: [MessageTag, RegExp][] = [
    ['dexscreener', /dexscreener\.com/i],
    ['pumpfun', /pump\.fun/i],
    ['twitter', /\b(?:x|twitter)\.com\//i],
    ['solana', /\bsolana\b/i],
    ['token', /\btokens?\b/i],
];

const normalize = (value: string) => value.trim().replace(/^@/, '').toLowerCase();

/** ¿El chat coincide con alguno de los grupos configurados (por título o @usuario)? */
export function matchesGroup(groups: string[], chatTitle: string | null, chatUsername: string | null): boolean {
    const wanted = groups.map(normalize).filter(Boolean);
    if (wanted.length === 0) {
        return true;
    }
    const title = normalize(chatTitle ?? '');
    const username = normalize(chatUsername ?? '');
    return wanted.some(g => (title && title.includes(g)) || (username && username === g));
}

export function detectTags(text: string): MessageTag[] {
    return TAG_PATTERNS.filter(([, re]) => re.test(text)).map(([tag]) => tag);
}

/**
 * Decide si un mensaje se guarda. Devuelve null si no pasa los filtros.
 * Sin grupos se escuchan todos los chats; sin palabras clave, todos los mensajes.
 */
export function filterMessage(rules: FilterRules, msg: IncomingMessage): FilterMatch | null {
    if (!msg.text.trim()) {
        return null;
    }
    if (!matchesGroup(rules.groups, msg.chatTitle, msg.chatUsername)) {
        return null;
    }
    const lower = msg.text.toLowerCase();
    const keywords = rules.keywords.filter(k => k.trim() && lower.includes(k.trim().toLowerCase()));
    if (rules.keywords.some(k => k.trim()) && keywords.length === 0) {
        return null;
    }
    return { keywords, tags: detectTags(msg.text) };
}
