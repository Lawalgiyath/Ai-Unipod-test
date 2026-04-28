# 🚀 AI UniPod News Scraper - Quick Reference

## Your API Key
```
6754ddf1929a4cf1b9de92d391eb753a
```

## 30-Second Setup

### Local Testing
```bash
# 1. Create .env file
echo "NEWS_API_KEY=6754ddf1929a4cf1b9de92d391eb753a" > .env

# 2. Install & run
npm install
npm run scrape:news
```

### GitHub Automation
```
1. Go to: Settings → Secrets → Actions
2. New secret: NEWS_API_KEY
3. Value: 6754ddf1929a4cf1b9de92d391eb753a
4. Enable Actions tab
```

## Commands

```bash
# Test scraper locally
npm run scrape:news

# Install dependencies
npm install

# Run with explicit key (one-time)
NEWS_API_KEY=6754ddf1929a4cf1b9de92d391eb753a npm run scrape:news
```

## Files

- **Scraper**: `scripts/scrape-news-advanced.js`
- **Workflow**: `.github/workflows/news-scraper.yml`
- **Config**: `.env` (create this)
- **Docs**: `docs/NEWS_SCRAPER_SETUP.md`

## How It Works

```
Every 6 hours → Scrape news → Filter → Update site → Auto-deploy
```

## Check Status

- **GitHub**: Actions tab → AI UniPod News Scraper
- **Local**: Run `npm run scrape:news` and check output
- **Website**: Visit news page for new articles

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No articles | Check API key, verify sources accessible |
| Scraper fails | Check logs in Actions tab |
| API error | Verify key at newsapi.org/account |

## Support

- Full guide: `docs/NEWS_SCRAPER_SETUP.md`
- API setup: `docs/API_KEY_SETUP.md`
- Quick start: `docs/QUICKSTART_NEWS_SCRAPER.md`

---

**Status**: ✅ Ready to use
**Schedule**: Every 6 hours (automatic)
**Sources**: UNILAG, NewsAPI, RSS feeds
