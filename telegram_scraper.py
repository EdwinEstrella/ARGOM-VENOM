from telethon import TelegramClient, events
import json
import sys
import asyncio
from datetime import datetime

class TelegramScraper:
    def __init__(self, api_id, api_hash, phone):
        self.client = TelegramClient('session_name', api_id, api_hash)
        self.phone = phone
        self.monitored_groups = []
        self.keywords = []
        self.messages = []
        self.is_running = False

    async def start_client(self):
        """Start the Telegram client"""
        try:
            await self.client.start(self.phone)
            print(f"✅ Connected to Telegram successfully")
            return True
        except Exception as e:
            print(f"❌ Failed to connect to Telegram: {e}")
            return False

    async def stop_client(self):
        """Stop the Telegram client"""
        self.is_running = False
        await self.client.disconnect()
        print("🔌 Telegram client disconnected")

    def set_monitored_groups(self, groups):
        """Set the list of groups to monitor"""
        self.monitored_groups = groups
        print(f"📋 Monitoring groups: {', '.join(groups)}")

    def set_keywords(self, keywords):
        """Set keywords to filter messages"""
        self.keywords = [kw.lower() for kw in keywords]
        print(f"🔍 Tracking keywords: {', '.join(keywords)}")

    def contains_keywords(self, text):
        """Check if message contains any tracked keywords"""
        if not self.keywords:
            return True

        text_lower = text.lower()
        return any(keyword in text_lower for keyword in self.keywords)

    def format_message(self, event):
        """Format message data for output"""
        return {
            'id': event.id,
            'group': event.chat.title if event.chat.title else event.chat.username,
            'message': event.message.text,
            'timestamp': datetime.now().isoformat(),
            'username': event.chat.username,
            'group_id': event.chat.id,
            'processed': False
        }

    async def message_handler(self, event):
        """Handle incoming messages"""
        if not self.is_running:
            return

        try:
            # Only process messages from monitored groups
            if self.monitored_groups:
                group_name = event.chat.title if event.chat.title else event.chat.username
                if not any(group.lower() in (group_name or '').lower() for group in self.monitored_groups):
                    return

            message_text = event.message.text
            if not message_text:
                return

            # Check for keywords if specified
            if self.contains_keywords(message_text):
                message_data = self.format_message(event)
                self.messages.append(message_data)

                # Print to console with enhanced formatting
                print("\n" + "="*60)
                print(f"📨 NUEVO MENSAJE EN: {message_data['group']}")
                print(f"🆔 ID: {message_data['id']}")
                print(f"👤 Usuario: @{message_data.get('username', 'N/A')}")
                print(f"📱 Grupo ID: {message_data.get('group_id', 'N/A')}")
                print(f"⏰ Timestamp: {message_data['timestamp']}")
                print("\n📝 MENSAJE:")
                print(f"─" * 40)
                print(f"{message_text}")
                print(f"─" * 40)

                # Detectar enlaces importantes
                if 'dexscreener.com' in message_text.lower():
                    print("🚀 ¡ENLACE DE DEXSCREENER DETECTADO!")
                if 'pump.fun' in message_text.lower():
                    print("🎯 ¡ENLANCE DE PUMP.FUN DETECTADO!")
                if 'x.com' in message_text.lower() or 'twitter.com' in message_text.lower():
                    print("🐦 ¡ENLACE DE TWITTER/X DETECTADO!")
                if 'solana' in message_text.lower():
                    print("☀️ ¡MENCIÓN DE SOLANA DETECTADA!")
                if 'token' in message_text.lower():
                    print("💰 ¡MENCIÓN DE TOKEN DETECTADA!")

                print("="*60)

                # Output as JSON for node integration
                print(f"DATA:{json.dumps(message_data)}", flush=True)

        except Exception as e:
            print(f"❌ Error processing message: {e}")

    async def start_listening(self):
        """Start listening for messages"""
        self.is_running = True

        # Register message handler for new messages
        @self.client.on(events.NewMessage())
        async def handler(event):
            await self.message_handler(event)

        print("🎧 Started listening for messages...")
        print("🔍 Monitoring for keywords:", ', '.join(self.keywords) if self.keywords else "All messages")

        # Keep the script running
        try:
            await self.client.run_until_disconnected()
        except KeyboardInterrupt:
            print("\n⏹️  Stopping message listener...")
            await self.stop_client()

async def main():
    """Main function to run the Telegram scraper"""
    if len(sys.argv) < 4:
        print("❌ Usage: python telegram_scraper.py <api_id> <api_hash> <phone> [groups...] [keywords...]")
        print("Example: python telegram_scraper.py 12345 abcdef123456 +1234567890 'Crypto Group' 'token' 'launch'")
        sys.exit(1)

    api_id = sys.argv[1]
    api_hash = sys.argv[2]
    phone = sys.argv[3]

    # Parse optional groups and keywords from command line
    groups = []
    keywords = []

    if len(sys.argv) > 4:
        # Find the split point between groups and keywords
        # We'll assume anything after 'keywords:' argument are keywords
        try:
            keywords_index = sys.argv.index('keywords:')
            groups = sys.argv[4:keywords_index]
            keywords = sys.argv[keywords_index + 1:]
        except ValueError:
            # No keywords specified, all remaining args are groups
            groups = sys.argv[4:]

    # Create and configure scraper
    scraper = TelegramScraper(api_id, api_hash, phone)

    if groups:
        scraper.set_monitored_groups(groups)
    if keywords:
        scraper.set_keywords(keywords)

    # Start the scraper
    try:
        connected = await scraper.start_client()
        if connected:
            await scraper.start_listening()
    except Exception as e:
        print(f"❌ Error: {e}")
        await scraper.stop_client()

if __name__ == "__main__":
    asyncio.run(main())