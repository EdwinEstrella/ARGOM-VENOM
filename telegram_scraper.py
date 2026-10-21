#!/usr/bin/env python3
import sys
import re
from telethon import TelegramClient, events

USAGE = """
Uso:

  python3 telegram_scraper.py <api_id> <api_hash> <telefono> [grupo1 grupo2 ...] keywords: palabra1 palabra2

Ejemplos:

  python3 telegram_scraper.py 35356344 "TU_API_HASH_REAL" +34123456789 "BINS GROUP" keywords: token launch
  python3 telegram_scraper.py 35356344 "TU_API_HASH_REAL" +34123456789 keywords: token launch
  python3 telegram_scraper.py 35356344 "TU_API_HASH_REAL" +34123456789
"""

def parse_cli(argv):
    if "keywords:" in argv:
        idx = argv.index("keywords:")
        keywords = argv[idx + 1:]
        argv = argv[:idx]
    else:
        keywords = []

    if len(argv) < 3:
        raise ValueError(USAGE)

    api_id = int(argv[0])
    api_hash = argv[1]
    phone = argv[2]
    target_groups = argv[3:]

    return api_id, api_hash, phone, target_groups, keywords


def normalize_chat_name(name):
    return (name or "").strip().lower()


def extract_text(message):
    if not message:
        return ""
    text = getattr(message, "message", "") or ""
    if text:
        return text
    return ""


async def main():
    api_id, api_hash, phone, target_groups, keywords = parse_cli(sys.argv[1:])

    session_name = "telegram_monitor_session"

    client = TelegramClient(session_name, api_id, api_hash)

    @client.on(events.NewMessage(incoming=True))
    async def handler(event):
        message = event.message
        if not message:
            return

        chat = await event.get_chat()
        chat_name = chat.title or chat.username or str(chat.id)
        chat_name_norm = normalize_chat_name(chat_name)

        # Si se pasaron grupos, solo revisamos esos grupos
        if target_groups:
            match = any(normalize_chat_name(group) in chat_name_norm for group in target_groups)
            if not match:
                return

        text = extract_text(message)
        if not text:
            return

        # Si hay keywords, filtramos por ellos
        if keywords:
            hay_keyword = any(k.lower() in text.lower() for k in keywords)
            if not hay_keyword:
                return

        sender = await event.get_sender()
        sender_name = getattr(sender, "username", None) or getattr(sender, "first_name", None) or str(sender.id)

        ts = message.date.strftime("%Y-%m-%d %H:%M:%S")
        print(f"\n[{ts}] {chat_name} | {sender_name}\n{text[:500]}")

    print("Iniciando sesión de Telegram...")
    await client.start(phone=phone)
    print("Escuchando mensajes...")
    await client.run_until_disconnected()


if __name__ == "__main__":
    try:
        import asyncio
        asyncio.run(main())
    except ValueError as e:
        print(e)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
