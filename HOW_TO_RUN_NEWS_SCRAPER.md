# How to Run the News Scraper

## Why Mock Data is Still There

**Mock data is SUPPOSED to be there!** It's the storage format. The scraper:
1. Fetches real news from APIs
2. Processes and filters it
3. **Writes it TO mock-data.js**
4. Website reads FROM mock-data.js

So `mock-data.js` will always exist, but it gets filled with REAL scraped news!

## Run It Now (Choose One Method)

### Method 1: One-Click Script (Easiest)

**Windows:**
```bash
run-news-scraper.bat
```

**Linux/Mac:**
```bash
chmod +x run-news-scraper.sh
./run-news-scraper.sh
```

### Method 2: Manual Commands

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Run scraper
npm run scrape:news
```

### Method 3: Test First

```bash
# Test if API key works
npm run scrape:test

# If test passes, run full scraper
npm run scrape:news
```

## What You'll See

```
🚀 AI UniPod News Scraper Starting...

📰 Fetching from sources...
📊 Found 25 articles
✨ 15 relevant articles
✅ Added 8 new articles

✅ Success!
```

## Check It Worked

1. Open `frontend/js/mock-data.js`
2. Look at the `news` array
3. You'll see new articles with:
   - `id: 'auto-...'` (auto-generated)
   - Recent dates
   - Real content from news sources

## Example Before/After

**Before (4 mock articles):**
```javascript
const MOCK_NEWS = [
  { id: '1', title: 'AI UniPod Lagos Officially Opens', ... },
  { id: '2', title: 'UNDP and UNILAG Sign Historic MoU', ... },
  { id: '3', title: 'Groundbreaking Ceremony...', ... },
  { id: '4', title: 'Eight Nigerian Universities...', ... }
];
```

**After (real scraped news added):**
```javascript
const MOCK_NEWS = [
  { id: 'auto-1714320000-0', title: 'Latest UNILAG AI Research...', ... },
  { id: 'auto-1714320000-1', title: 'Nigeria Tech Innovation...', ... },
  { id: 'auto-1714320000-2', title: 'UNDP Announces New...', ... },
  { id: '1', title: 'AI UniPod Lagos Officially Opens', ... },
  { id: '2', title: 'UNDP and UNILAG Sign Historic MoU', ... },
  ...
];
```

## Troubleshooting

### "Cannot find module 'axios'"
```bash
npm install
```

### "No new articles to add"
This means:
- ✅ Scraper is working
- ⚠️ No new relevant articles found
- This is normal if you run it multiple times quickly

### "API key not found"
Create `.env` file:
```bash
echo "NEWS_API_KEY=6754ddf1929a4cf1b9de92d391eb753a" > .env
```

### Still not working?
Run test to see what's happening:
```bash
npm run scrape:test
```

## Automate It (GitHub Actions)

Once you verify it works locally:

1. Go to GitHub: **Settings → Secrets → Actions**
2. Add secret:
   - Name: `NEWS_API_KEY`
   - Value: `6754ddf1929a4cf1b9de92d391eb753a`
3. Push your code
4. GitHub Actions will run every 6 hours automatically

## Manual Updates

Run anytime to get fresh news:
```bash
npm run scrape:news
```

Then commit and push:
```bash
git add frontend/js/mock-data.js
git commit -m "Update news articles"
git push
```

## Summary

- ✅ Mock data is the storage (it's supposed to be there!)
- ✅ Scraper fetches real news and writes to mock-data.js
- ✅ Run `npm run scrape:news` to update
- ✅ GitHub Actions will auto-update every 6 hours
- ✅ Website always reads from mock-data.js (with real content)

The system is working as designed!
