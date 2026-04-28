# Setting Up Your NewsAPI Key

## You Have Your API Key: `6754ddf1929a4cf1b9de92d391eb753a`

⚠️ **IMPORTANT**: Never commit this key to Git! It's already protected by `.gitignore`.

## Quick Setup Options

### Option 1: Automated Setup (Recommended)

**On Linux/Mac:**
```bash
chmod +x scripts/setup-news-scraper.sh
./scripts/setup-news-scraper.sh
```

**On Windows:**
```bash
scripts\setup-news-scraper.bat
```

### Option 2: Manual Setup

#### For Local Testing

1. Create `.env` file in project root:
```bash
echo "NEWS_API_KEY=6754ddf1929a4cf1b9de92d391eb753a" > .env
```

2. Install dependencies:
```bash
npm install
```

3. Test the scraper:
```bash
npm run scrape:news
```

#### For GitHub Actions (Automated)

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter:
   - **Name**: `NEWS_API_KEY`
   - **Value**: `6754ddf1929a4cf1b9de92d391eb753a`
5. Click **Add secret**

### Option 3: Environment Variable (Quick Test)

**Linux/Mac:**
```bash
export NEWS_API_KEY="6754ddf1929a4cf1b9de92d391eb753a"
npm run scrape:news
```

**Windows (PowerShell):**
```powershell
$env:NEWS_API_KEY="6754ddf1929a4cf1b9de92d391eb753a"
npm run scrape:news
```

**Windows (CMD):**
```cmd
set NEWS_API_KEY=6754ddf1929a4cf1b9de92d391eb753a
npm run scrape:news
```

## Verify Setup

Test that everything works:

```bash
# Install dependencies
npm install

# Run scraper
npm run scrape:news
```

You should see output like:
```
🚀 AI UniPod News Scraper Starting...

📰 Fetching from sources...
📊 Found 25 articles
✨ 15 relevant articles
✅ Added 8 new articles

✅ Success!
```

## Security Checklist

- ✅ `.env` file is in `.gitignore`
- ✅ Never share your API key publicly
- ✅ Use GitHub Secrets for automation
- ✅ Don't commit API keys to Git
- ✅ Rotate keys if exposed

## Troubleshooting

### "API key not found" error
- Check `.env` file exists
- Verify key is correct
- Ensure no extra spaces

### "Invalid API key" error
- Verify key at https://newsapi.org/account
- Check if key is active
- Ensure you're on correct plan

### No articles found
- API key is working but no matches
- Try adjusting keywords in scraper
- Check NewsAPI dashboard for usage

## Next Steps

1. ✅ Set up API key (you're here!)
2. Test locally: `npm run scrape:news`
3. Add to GitHub Secrets
4. Enable GitHub Actions
5. Watch news auto-update every 6 hours!

## API Key Info

- **Your Key**: `6754ddf1929a4cf1b9de92d391eb753a`
- **Provider**: NewsAPI.org
- **Free Tier**: 100 requests/day
- **Rate Limit**: Sufficient for 6-hour updates

## Need Help?

- NewsAPI Docs: https://newsapi.org/docs
- Check scraper logs: GitHub Actions tab
- Test locally first before deploying
- Review `docs/NEWS_SCRAPER_SETUP.md` for details
