import { describe, expect, it } from 'vitest';
import { detectTags, filterMessage, matchesGroup } from '../telegram/filter';

describe('matchesGroup', () => {
    it('sin grupos acepta cualquier chat', () => {
        expect(matchesGroup([], 'Lo que sea', null)).toBe(true);
    });

    it('coincide por parte del título sin distinguir mayúsculas', () => {
        expect(matchesGroup(['crypto enfermos'], 'CryptoEnfermos Chat', null)).toBe(false);
        expect(matchesGroup(['cryptoenfermos'], 'CryptoEnfermosChat', null)).toBe(true);
    });

    it('coincide por @usuario exacto', () => {
        expect(matchesGroup(['@solcalls'], null, 'SolCalls')).toBe(true);
        expect(matchesGroup(['@sol'], null, 'SolCalls')).toBe(false);
    });
});

describe('detectTags', () => {
    it('detecta enlaces y menciones relevantes', () => {
        expect(detectTags('Nuevo en https://pump.fun/abc y https://dexscreener.com/solana/xyz')).toEqual([
            'dexscreener',
            'pumpfun',
            'solana',
        ]);
        expect(detectTags('mira https://x.com/user/status/1 este token')).toEqual(['twitter', 'token']);
    });

    it('no confunde dominios que solo contienen x.com', () => {
        expect(detectTags('visita https://dex.com/')).toEqual([]);
    });
});

describe('filterMessage', () => {
    const msg = (text: string, chatTitle = 'Grupo Alfa') => ({ chatTitle, chatUsername: null, text });

    it('descarta mensajes vacíos', () => {
        expect(filterMessage({ groups: [], keywords: [] }, msg('   '))).toBeNull();
    });

    it('sin palabras clave guarda todo', () => {
        expect(filterMessage({ groups: [], keywords: [] }, msg('hola'))).toEqual({ keywords: [], tags: [] });
    });

    it('exige al menos una palabra clave y devuelve cuáles coincidieron', () => {
        const rules = { groups: ['alfa'], keywords: ['LAUNCH', 'pump.fun'] };
        expect(filterMessage(rules, msg('nada interesante'))).toBeNull();
        expect(filterMessage(rules, msg('Launch en pump.fun ya'))).toEqual({
            keywords: ['LAUNCH', 'pump.fun'],
            tags: ['pumpfun'],
        });
        expect(filterMessage(rules, msg('launch', 'Grupo Beta'))).toBeNull();
    });
});
