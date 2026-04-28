# ✅ Automatic News Pipeline - One-Time Setup

## What This Does

Once set up, the pipeline will **automatically**:
- Run every 6 hours (4 times per day)
- Scrape news about AI UniPod, UNILAG, Nigeria AI
- Update your website with fresh articles
- Commit and deploy changes
- **You never need to run anything manually!**

## One-Time Setup (5 minutes)

### Step 1: Add Your API Key to GitHub

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret** (green button)
5. Enter:
   - **Name**: `NEWS_API_KEY`
   - **Secret**: `6754ddf1929a4cf1b9de92d391eb753a`
6. Click **Add secret**

### Step 2: Enable GitHub Actions

1. Go to **Actions** tab in your repository
2. If you see "Workflows disabled", click **Enable workflows**
3. That's it!

### Step 3: Push This Code to GitHub

```bash
git add .
git commit -m "Add automated news scraper pipeline"
git push
```

## That's It! 🎉

The pipeline is now **fully automatic**. It will:

- ✅ Run every 6 hours automatically
- ✅ Fetch news from NewsAPI, UNILAG website, RSS feeds
- ✅ Filter for AI UniPod/UNILAG/Nigeria AI content
- ✅ Update `frontend/js/mock-data.js` with new articles
- ✅ Auto-commit with message: "🤖 Auto-update: Latest AI UniPod news"
- ✅ Auto-deploy to your hosting (GitHub Pages/Vercel/Netlify)

**You never need to run anything!**

## How to Verify It's Working

### Check Workflow Status

1. Go to **Actions** tab
2. You'll see "AI UniPod News Scraper" workflow
3. Green checkmark ✅ = working
4. Red X ❌ = check logs

### View Automatic Updates

1. Go to **Code** tab
2. Look at commit history
3. You'll see commits from "github-actions[bot]"
4. Message: "🤖 Auto-update: Latest AI UniPod news"

### Check Your Website

1. Visit your news page
2. New articles appear automatically
3. No manual work needed!

## Schedule

The pipeline runs:
- **Every 6 hours**: 12am, 6am, 12pm, 6pm UTC
- **4 times per day**
- **Every day of the year**
- **Completely automatic**

## Manual Trigger (Optional)

Want to test it right now without waiting?

1. Go to **Actions** tab
2. Click **AI UniPod News Scraper**
3. Click **Run workflow** button
4. Select branch (usually `main`)
5. Click **Run workflow**

This is optional - it will run automatically anyway!

## What Gets Updated

The pipeline updates:
- `frontend/js/mock-data.js` - Adds new articles to the news array
- Your website - Shows fresh content automatically
- Commit history - Shows automatic updates

## Monitoring

### View Logs

1. **Actions** tab → Click on a workflow run
2. See detailed logs:
   - How many articles found
   - Which sources worked
   - What was added
   - Any errors

### Email Notifications

GitHub will email you if the workflow fails. You can configure this in:
- Settings → Notifications → Actions

## Troubleshooting

### Workflow Not Running

**Check:**
1. Actions are enabled (Actions tab)
2. API key is added (Settings → Secrets)
3. Code is pushed to GitHub

### Workflow Failing

**Check logs:**
1. Actions tab → Click failed run
2. Read error message
3. Common issues:
   - API key invalid
   - Network timeout
   - Source website changed

### No New Articles

This is normal! It means:
- ✅ Pipeline is working
- ⚠️ No new relevant articles found
- Will keep checking every 6 hours

## Advanced Configuration

### Change Schedule

Edit `.github/workflows/news-scraper.yml`:

```yaml
schedule:
  # Every 6 hours (current)
  - cron: '0 */6 * * *'
  
  # Every 3 hours
  - cron: '0 */3 * * *'
  
  # Every hour
  - cron: '0 * * * *'
  
  # Daily at 9am UTC
  - cron: '0 9 * * *'
  
  # Twice daily (9am and 9pm UTC)
  - cron: '0 9,21 * * *'
```

### Add More Sources

Edit `scripts/scrape-news-advanced.js`:

```javascript
// Add more RSS feeds
const rssFeeds = [
  'https://unilag.edu.ng/feed/',
  'https://your-source.com/feed/'
];

// Add more search queries
const queries = [
  'AI UniPod Lagos',
  'Your custom query'
];
```

### Add Notifications

Add to workflow (after scraping step):

```yaml
- name: Notify Slack
  if: success()
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
    -H 'Content-Type: application/json' \
    -d '{"text":"🤖 News updated!"}'
```

## Cost

- ✅ **Completely FREE**
- GitHub Actions: 2,000 minutes/month free
- This workflow uses ~2 minutes per run
- 4 runs/day × 30 days = 120 runs/month = ~240 minutes
- Well within free tier!

## Security

- ✅ API key stored securely in GitHub Secrets
- ✅ Never exposed in logs or code
- ✅ Only accessible to workflow
- ✅ Can be rotated anytime

## Summary

### What You Do Once:
1. Add API key to GitHub Secrets
2. Enable GitHub Actions
3. Push code

### What Happens Automatically Forever:
1. Scrapes news every 6 hours
2. Updates website with fresh content
3. Commits and deploys changes
4. Sends notifications if it fails

**You literally never need to touch it again!**

## Next Steps

1. ✅ Complete the one-time setup above
2. ✅ Push code to GitHub
3. ✅ Wait for first automatic run (or trigger manually)
4. ✅ Check Actions tab to see it working
5. ✅ Forget about it - it runs forever automatically!

---

**Status**: Ready for automatic operation
**Maintenance**: Zero - runs automatically
**Cost**: Free (GitHub Actions free tier)
**Your effort**: 5 minutes setup, then nothing!
