# 🚀 Get News Scraper Working NOW

## The Issue
The scraper is set up but hasn't run yet. Mock data is still there because the scraper needs to be executed.

## Quick Fix (2 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Test the Scraper
```bash
npm run scrape:test
```

You should see:
```
🧪 Testing News Scraper...
✅ API Key found
🔍 Fetching news...
✅ Success! Found X articles
📰 Sample articles:
...
```

### Step 3: Run Full Scraper
```bash
npm run scrape:news
```

This will:
- Fetch news from multiple sources
- Filter for AI UniPod relevance
- Update `frontend/js/mock-data.js`
- Add real news articles

## If It's Not Working

### Error: "Cannot find module 'axios'"
```bash
npm install axios cheerio
```

### Error: "Invalid API key"
Your API key might be wrong. Create `.env` file:
```bash
echo "NEWS_API_KEY=6754ddf1929a4cf1b9de92d391eb753a" > .env
```

### Error: "No articles found"
The scraper is working but no matches. This is normal - it means:
- No recent news about UNILAG/AI UniPod
- Keywords need adjustment

## What Happens After Running

1. **Mock data gets updated** with real articles
2. **News page shows real content** from NewsAPI
3. **GitHub Actions will auto-update** every 6 hours

## Check It Worked

1. Run: `npm run scrape:news`
2. Look for: `✅ Added X new articles`
3. Open: `frontend/js/mock-data.js`
4. See new articles at top of `news` array

## Why Mock Data is Still There

Mock data is the **storage format**. The scraper:
- ✅ Fetches real news
- ✅ Processes it
- ✅ Writes to mock-data.js
- ✅ Website reads from mock-data.js

So mock-data.js will always be there, but with REAL scraped content!

## Automate It

### For GitHub Actions:
1. Go to: Settings → Secrets → Actions
2. Add: `NEWS_API_KEY` = `6754ddf1929a4cf1b9de92d391eb753a`
3. Push code to GitHub
4. Actions will run every 6 hours automatically

## Manual Update Anytime

```bash
npm run scrape:news
git add frontend/js/mock-data.js
git commit -m "Update news"
git push
```

## Still Not Working?

Run with debug:
```bash
node scripts/test-scraper.js
```

This will show exactly what's happening.
