# Quick Start: AI UniPod News Scraper

## What It Does

Automatically pulls news about AI UniPod from multiple sources every 6 hours and updates your website.

## 5-Minute Setup

### 1. Get NewsAPI Key (Free)

```bash
# Visit: https://newsapi.org/register
# Sign up → Get API Key → Copy it
```

### 2. Add to GitHub

```bash
# In your GitHub repo:
Settings → Secrets and variables → Actions → New repository secret

Name: NEWS_API_KEY
Value: [paste your key]
```

### 3. Enable Workflow

```bash
# In your GitHub repo:
Actions tab → Enable workflows
```

### 4. Done! 🎉

The scraper will now run automatically every 6 hours.

## Manual Run

Want to test it now?

```bash
# In your repo:
Actions → AI UniPod News Scraper → Run workflow
```

## Local Testing

```bash
# Install dependencies
npm install

# Set your API key
export NEWS_API_KEY="your-key-here"

# Run scraper
npm run scrape:news
```

## What Gets Scraped

- ✅ UNILAG official news
- ✅ AI & innovation articles
- ✅ Nigeria tech news
- ✅ UNDP Timbuktoo updates

## How to Check It's Working

1. Go to **Actions** tab
2. See green checkmarks ✅
3. Check your website's news page
4. New articles appear automatically!

## Customize Schedule

Edit `.github/workflows/news-scraper.yml`:

```yaml
# Every 6 hours (default)
- cron: '0 */6 * * *'

# Every hour
- cron: '0 * * * *'

# Daily at 9am
- cron: '0 9 * * *'
```

## Troubleshooting

**No articles appearing?**
- Check Actions tab for errors
- Verify NewsAPI key is correct
- Run locally to test: `npm run scrape:news`

**Too many/few articles?**
- Edit keywords in `scripts/scrape-news-advanced.js`
- Adjust relevance filters

## Need Help?

See full documentation: `docs/NEWS_SCRAPER_SETUP.md`
