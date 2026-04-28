# AI UniPod News Scraper - CI/CD Setup Guide

## Overview

The AI UniPod website features an automated news scraping system that pulls relevant news articles about the AI UniPod, UNILAG, and AI innovation in Nigeria. The system runs automatically every 6 hours via GitHub Actions.

## Features

- ✅ Automated news collection from multiple sources
- ✅ RSS feed parsing (UNILAG website)
- ✅ Web scraping for university news
- ✅ NewsAPI integration for broader coverage
- ✅ Intelligent filtering for relevant content
- ✅ Automatic deduplication
- ✅ GitHub Actions CI/CD pipeline
- ✅ Auto-commit and deploy updates

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions Workflow                   │
│                  (Runs every 6 hours)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   News Scraper Script                        │
│              (scripts/scrape-news-advanced.js)               │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
         ┌──────────┐  ┌──────────┐  ┌──────────┐
         │ UNILAG   │  │ NewsAPI  │  │   RSS    │
         │  Website │  │          │  │  Feeds   │
         └──────────┘  └──────────┘  └──────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Filter & Process │
                    │   Deduplicate     │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Update mock-data.js│
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Git Commit & Push│
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Auto Deploy      │
                    └──────────────────┘
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `axios` - HTTP client for API requests
- `cheerio` - HTML parsing and web scraping
- `node-fetch` - Fetch API for Node.js

### 2. Get NewsAPI Key (Optional but Recommended)

1. Go to [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free account
3. Get your API key
4. Add it to GitHub Secrets (see step 3)

### 3. Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secret:
   - Name: `NEWS_API_KEY`
   - Value: Your NewsAPI key

### 4. Enable GitHub Actions

1. Go to **Actions** tab in your repository
2. Enable workflows if prompted
3. The workflow will run automatically every 6 hours

### 5. Manual Trigger (Optional)

You can manually trigger the news scraper:

1. Go to **Actions** tab
2. Select **AI UniPod News Scraper** workflow
3. Click **Run workflow**
4. Select branch and click **Run workflow**

## Local Testing

Test the scraper locally before deploying:

```bash
# Set your NewsAPI key (optional)
export NEWS_API_KEY="your-api-key-here"

# Run the scraper
npm run scrape:news
```

## Configuration

### News Sources

Edit `scripts/scrape-news-advanced.js` to customize:

```javascript
// Add more RSS feeds
const rssFeeds = [
  'https://unilag.edu.ng/feed/',
  'https://example.com/feed/'
];

// Customize search queries
const queries = [
  '"AI UniPod" Lagos',
  'UNILAG artificial intelligence',
  // Add your queries here
];

// Adjust relevance keywords
const keywords = [
  'ai unipod', 'unilag', 'innovation',
  // Add more keywords
];
```

### Schedule

Edit `.github/workflows/news-scraper.yml` to change frequency:

```yaml
on:
  schedule:
    # Current: Every 6 hours
    - cron: '0 */6 * * *'
    
    # Options:
    # Every hour: '0 * * * *'
    # Every 12 hours: '0 */12 * * *'
    # Daily at 9am: '0 9 * * *'
    # Twice daily: '0 9,21 * * *'
```

## How It Works

### 1. Data Collection

The scraper fetches news from:

- **UNILAG RSS Feed**: Official university news
- **UNILAG Website**: Direct web scraping
- **NewsAPI**: Broader news coverage with keywords

### 2. Processing

- Filters articles for relevance (AI, innovation, UNILAG keywords)
- Removes duplicates based on title similarity
- Sorts by publication date (newest first)
- Limits to top 50 articles

### 3. Storage

Updates `frontend/js/mock-data.js`:

```javascript
const MOCK_NEWS = [
  {
    id: 'auto-1234567890-0',
    title: 'Article Title',
    slug: 'article-title',
    excerpt: 'Brief description...',
    content: '<p>Full content...</p>',
    cover_image: 'https://...',
    category: 'News',
    author: 'Source Name',
    published_date: '2026-04-28T10:00:00Z',
    published: true,
    featured: false,
    tags: ['AI', 'Innovation', 'UNILAG'],
    source_url: 'https://original-article-url'
  },
  // ... more articles
];
```

### 4. Deployment

- Commits changes with message: `🤖 Auto-update: Latest AI UniPod news`
- Pushes to repository
- Triggers automatic deployment (if configured)

## Monitoring

### Check Workflow Status

1. Go to **Actions** tab
2. View recent workflow runs
3. Click on a run to see logs

### View Logs

Logs show:
- Number of articles fetched from each source
- Number of relevant articles found
- Number of new articles added
- Any errors encountered

### Troubleshooting

**No articles found:**
- Check if sources are accessible
- Verify NewsAPI key is valid
- Review keyword filters (may be too strict)

**Scraper fails:**
- Check GitHub Actions logs
- Verify dependencies are installed
- Ensure mock-data.js format is correct

**Duplicates appearing:**
- Check title normalization logic
- Adjust deduplication algorithm

## Advanced Customization

### Add New Sources

```javascript
// In scrape-news-advanced.js

async function fetchFromCustomSource() {
  try {
    const response = await axios.get('https://your-source.com/api');
    return response.data.articles.map(a => ({
      title: a.title,
      link: a.url,
      description: a.description,
      image: a.image,
      pubDate: a.date,
      author: a.author,
      category: 'Custom Source'
    }));
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
}

// Add to main function
const customArticles = await fetchFromCustomSource();
const allArticles = [...rssArticles, ...customArticles, ...];
```

### Custom Filtering

```javascript
function customFilter(article) {
  // Your custom logic
  const score = calculateRelevanceScore(article);
  return score > 0.7;
}

const filtered = articles.filter(customFilter);
```

### Webhook Notifications

Add Slack/Discord notifications when new articles are found:

```javascript
async function notifySlack(articles) {
  await axios.post(process.env.SLACK_WEBHOOK_URL, {
    text: `🤖 Found ${articles.length} new AI UniPod articles!`
  });
}
```

## Security Notes

- Never commit API keys to the repository
- Use GitHub Secrets for sensitive data
- Respect robots.txt when scraping
- Add rate limiting for API calls
- Use appropriate User-Agent headers

## Maintenance

### Regular Tasks

- **Weekly**: Review scraped articles for quality
- **Monthly**: Update keyword filters
- **Quarterly**: Check source availability
- **As needed**: Adjust scraping selectors if websites change

### Updates

Keep dependencies updated:

```bash
npm update
npm audit fix
```

## Support

For issues or questions:
1. Check GitHub Actions logs
2. Review this documentation
3. Test locally with `npm run scrape:news`
4. Contact the development team

## License

This scraper is part of the AI UniPod Lagos website project.
