import { describe, expect, it, vi } from 'vitest';
import type { TelegramStatusEvent } from '../../../shared/api';
import type { AuthPrompts, ConnectOptions, RawMessage, TelegramGateway } from '../telegram/gateway';
import { MessageStore } from '../telegram/messages';
import { TelegramError, TelegramService } from '../telegram/service';
import { fakeSecrets, memoryDb } from './helpers';

const VALID_INPUT = {
    apiId: '12345',
    apiHash: '0123456789abcdef0123456789abcdef',
    phone: '+34 600 111 222',
    groups: ['Alfa', 'Alfa', ' '],
    keywords: ['launch'],
    autoConnect: false,
};

/** Gateway falso controlable desde el test. */
class FakeGateway implements TelegramGateway {
    opts?: ConnectOptions;
    prompts?: AuthPrompts;
    emit?: (msg: RawMessage) => void;
    disconnected = false;
    private finish?: { resolve(s: string): void; reject(e: unknown): void };

    connect(opts: ConnectOptions, prompts: AuthPrompts): Promise<string> {
        this.opts = opts;
        this.prompts = prompts;
        return new Promise((resolve, reject) => (this.finish = { resolve, reject }));
    }
    succeed(session = 'SESSION') {
        this.finish?.resolve(session);
    }
    fail(err: unknown) {
        this.finish?.reject(err);
    }
    onMessage(cb: (msg: RawMessage) => void) {
        this.emit = cb;
    }
    async disconnect() {
        this.disconnected = true;
    }
}

function setup() {
    const { db, settings } = memoryDb();
    const gateways: FakeGateway[] = [];
    const service = new TelegramService(settings, fakeSecrets, new MessageStore(db), () => {
        const g = new FakeGateway();
        gateways.push(g);
        return g;
    });
    const statuses: TelegramStatusEvent[] = [];
    service.on('status', s => statuses.push(s));
    return { service, settings, gateways, statuses, last: () => gateways[gateways.length - 1] };
}

const tick = () => new Promise(r => setTimeout(r, 0));

describe('TelegramService: configuración', () => {
    it('valida y normaliza la configuración, y nunca devuelve el api_hash', () => {
        const { service, settings } = setup();
        const config = service.saveConfig(VALID_INPUT);
        expect(config).toEqual({
            apiId: '12345',
            phone: '+34600111222',
            groups: ['Alfa'],
            keywords: ['launch'],
            autoConnect: false,
            hasApiHash: true,
            hasSession: false,
        });
        expect(JSON.stringify(config)).not.toContain(VALID_INPUT.apiHash);
        expect(settings.get('telegram.apiHash')).toBe(`sealed(${VALID_INPUT.apiHash})`);
    });

    it.each([
        [{ apiId: 'abc' }, /numérico/],
        [{ phone: '600111222' }, /internacional/],
        [{ apiHash: 'corto' }, /32 caracteres/],
    ])('rechaza %o', (patch, error) => {
        const { service } = setup();
        expect(() => service.saveConfig({ ...VALID_INPUT, ...patch })).toThrow(error);
    });

    it('no se puede conectar sin credenciales', async () => {
        const { service } = setup();
        await expect(service.connect()).rejects.toThrow(TelegramError);
    });
});

describe('TelegramService: login', () => {
    it('pide el código por la UI, guarda la sesión cifrada y queda conectado', async () => {
        const { service, settings, last, statuses } = setup();
        service.saveConfig(VALID_INPUT);

        const connecting = service.connect();
        expect(last().opts).toMatchObject({ apiId: 12345, apiHash: VALID_INPUT.apiHash, phone: '+34600111222', session: '' });

        const code = last().prompts!.phoneCode();
        expect(service.getStatus().status).toBe('awaiting_code');
        service.submitCode(' 12345 ');
        await expect(code).resolves.toBe('12345');

        last().succeed('SESSION-1');
        await connecting;
        expect(service.getStatus()).toEqual({ status: 'connected' });
        expect(settings.get('telegram.session')).toBe('sealed(SESSION-1)');
        expect(service.getConfig().hasSession).toBe(true);
        expect(statuses.map(s => s.status)).toEqual(['connecting', 'awaiting_code', 'connecting', 'connected']);
    });

    it('reutiliza la sesión guardada en la siguiente conexión', async () => {
        const { service, last } = setup();
        service.saveConfig(VALID_INPUT);
        const first = service.connect();
        last().succeed('SESSION-1');
        await first;
        await service.disconnect();

        const second = service.connect();
        expect(last().opts?.session).toBe('SESSION-1');
        last().succeed('SESSION-1');
        await second;
    });

    it('con código incorrecto vuelve a pedirlo mostrando el error', async () => {
        const { service, last } = setup();
        service.saveConfig(VALID_INPUT);
        void service.connect();

        const retry = last().prompts!.onError(Object.assign(new Error('x'), { errorMessage: 'PHONE_CODE_INVALID' }));
        expect(retry).toBe(false);
        expect(service.getStatus()).toEqual({ status: 'awaiting_code', error: 'Código incorrecto, vuelve a intentarlo' });
    });

    it('gestiona la verificación en dos pasos', async () => {
        const { service, last } = setup();
        service.saveConfig(VALID_INPUT);
        void service.connect();

        const pw = last().prompts!.password('mi pista');
        expect(service.getStatus()).toEqual({ status: 'awaiting_password', passwordHint: 'mi pista' });
        service.submitPassword('secreto');
        await expect(pw).resolves.toBe('secreto');
    });

    it('un error definitivo aborta el login con un mensaje claro', async () => {
        const { service, last } = setup();
        service.saveConfig(VALID_INPUT);
        const connecting = service.connect();

        const apiError = Object.assign(new Error('API_ID_INVALID'), { errorMessage: 'API_ID_INVALID' });
        expect(last().prompts!.onError(apiError)).toBe(true);
        last().fail(new Error('AUTH_USER_CANCEL'));

        await expect(connecting).rejects.toThrow('API ID o API Hash no válidos');
        expect(service.getStatus()).toEqual({ status: 'error', error: 'API ID o API Hash no válidos' });
        expect(last().disconnected).toBe(true);
    });

    it('desconectar mientras espera el código cancela el login sin error', async () => {
        const { service, last } = setup();
        service.saveConfig(VALID_INPUT);
        const connecting = service.connect();
        const code = last().prompts!.phoneCode();

        await service.disconnect();
        await expect(code).rejects.toThrow();
        expect(last().prompts!.onError(new Error('Code is empty'))).toBe(true);
        last().fail(new Error('AUTH_USER_CANCEL'));
        await expect(connecting).resolves.toBeUndefined();
        expect(service.getStatus()).toEqual({ status: 'disconnected' });
    });

    it('el fallo tardío de un intento cancelado no pisa la conexión nueva', async () => {
        const { service, gateways } = setup();
        service.saveConfig(VALID_INPUT);
        const first = service.connect();
        await service.disconnect();

        const second = service.connect();
        gateways[0].fail(new Error('connection closed'));
        await first;
        expect(service.getStatus()).toEqual({ status: 'connecting' });

        gateways[1].succeed();
        await second;
        expect(service.getStatus()).toEqual({ status: 'connected' });
    });

    it('cambiar de teléfono invalida la sesión guardada', async () => {
        const { service, last } = setup();
        service.saveConfig(VALID_INPUT);
        const c = service.connect();
        last().succeed();
        await c;
        await service.disconnect();

        service.saveConfig({ ...VALID_INPUT, apiHash: undefined, phone: '+34600999888' });
        expect(service.getConfig().hasSession).toBe(false);
        expect(service.getConfig().hasApiHash).toBe(true);
    });
});

describe('TelegramService: mensajes', () => {
    it('filtra, guarda y emite los mensajes entrantes', async () => {
        const { service, last } = setup();
        service.saveConfig(VALID_INPUT);
        const c = service.connect();
        last().succeed();
        await c;

        const onMessage = vi.fn();
        service.on('message', onMessage);
        const date = new Date('2026-10-21T12:00:00Z');
        last().emit!({ chatId: '-100', chatTitle: 'Beta', chatUsername: null, senderName: null, text: 'launch', date });
        last().emit!({ chatId: '-100', chatTitle: 'Alfa', chatUsername: null, senderName: '@ana', text: 'sin interés', date });
        last().emit!({ chatId: '-100', chatTitle: 'Alfa', chatUsername: null, senderName: '@ana', text: 'Launch en pump.fun', date });
        await tick();

        expect(onMessage).toHaveBeenCalledTimes(1);
        expect(onMessage.mock.calls[0][0]).toMatchObject({
            chatName: 'Alfa',
            senderName: '@ana',
            keywords: ['launch'],
            tags: ['pumpfun'],
            sentAt: '2026-10-21T12:00:00.000Z',
        });
    });

    it('aplica en vivo los filtros nuevos sin reconectar', async () => {
        const { service, last } = setup();
        service.saveConfig(VALID_INPUT);
        const c = service.connect();
        last().succeed();
        await c;

        service.saveConfig({ ...VALID_INPUT, apiHash: undefined, groups: [], keywords: [] });
        const onMessage = vi.fn();
        service.on('message', onMessage);
        last().emit!({ chatId: '1', chatTitle: 'Cualquiera', chatUsername: null, senderName: null, text: 'hola', date: new Date() });
        expect(onMessage).toHaveBeenCalledTimes(1);
    });
});
