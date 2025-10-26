# Telegram Scraper Setup Guide

This module allows you to monitor Telegram groups for LP (Liquidity Pool) opportunities and trading signals.

## Prerequisites

### 1. Get Telegram API Credentials

1. Go to [my.telegram.org](https://my.telegram.org)
2. Sign in with your phone number
3. Go to **API development tools**
4. Fill out the form:
   - App title: Any name you prefer
   - Short name: A short version of the name
   - Platform: Desktop
5. Submit the form and copy your **API ID** and **API Hash**

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

## Configuration

### In the Venom App:

1. Navigate to **TeleScraper** in the sidebar
2. Fill in your credentials:
   - **API ID**: Your numeric API ID from my.telegram.org
   - **API Hash**: Your API hash from my.telegram.org
   - **Phone Number**: Your phone number with country code (+1234567890)

### Groups to Monitor:

Add the Telegram groups you want to monitor:
- Group names (e.g., "Crypto Signals")
- Group usernames (e.g., "@cryptogroup")
- Private group links (if you have access)

### Keywords to Track:

Optional keywords to filter messages:
- "token launch"
- "new LP"
- "presale"
- "airdrop"
- Custom keywords that interest you

## Usage

1. **Connect**: Click "Connect to Telegram" to start the scraper
2. **Monitor**: The app will listen for messages in real-time
3. **Filter**: Only messages containing your keywords will be captured
4. **View**: All captured messages appear in the Messages Feed

## Python Script Usage

You can also run the Python script directly:

```bash
python telegram_scraper.py <api_id> <api_hash> <phone> [groups...] keywords: [keywords...]
```

Example:
```bash
python telegram_scraper.py 12345 abcdef123456 +1234567890 "Crypto Group" "Trading Signals" keywords: "token" "launch" "LP"
```

## Features

- **Real-time monitoring**: Live message capture from Telegram groups
- **Keyword filtering**: Only capture messages that contain specific keywords
- **Multiple groups**: Monitor multiple groups simultaneously
- **LP integration**: Works with your existing LP Sniper functionality
- **Secure communication**: All API communication handled through Electron backend

## Security Notes

- Your API credentials are stored locally only
- Never share your API ID and API hash
- The script only reads messages, it cannot send messages
- Make sure you only join groups you trust

## Troubleshooting

### Connection Issues:
- Verify your API ID and API hash are correct
- Ensure your phone number includes the country code
- Check that you're joined to the groups you want to monitor

### Python Issues:
- Make sure you have Python 3.7+ installed
- Install dependencies: `pip install -r requirements.txt`
- On first run, you may need to enter a verification code

### Performance:
- Monitor fewer groups for better performance
- Use specific keywords to reduce noise
- Clear the message feed regularly

## Integration with LP Sniper

The Telegram Scraper works seamlessly with the LP Sniper:
- Capture token launch announcements
- Identify early liquidity pool opportunities
- Get real-time trading signals from trusted groups
- Filter messages to focus on LP-related content

## Support

For issues or questions:
1. Check the console for error messages
2. Verify your Telegram API credentials
3. Ensure Python dependencies are installed
4. Make sure you're joined to the target groups