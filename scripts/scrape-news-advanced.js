#!/usr/bin/env node

/**
 * Advanced AI UniPod News Scraper with RSS and Web Scraping
 * Uses multiple sources and intelligent content extraction
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file if it exists
try {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (error) {
  // .env file not found or error reading it, continue with environment variables
}

const MOCK_DATA_PATH = path.join(__dirname, '../frontend/js/mock-data.js');

/**
 * Parse RSS feed
 */
async function parseRSSFeed(url) {
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(response.data, { xmlMode: true });
    
    const items = [];
    $('item').each((i, elem) => {
      const $item = $(elem);
      items.push({
        title: $item.find('title').text().trim(),
        description: $item.find('description').text().trim().replace(/<[^>]*>/g, ''),
        link: $item.find('link').text().trim(),
        pubDate: $item.find('pubDate').text().trim(),
        author: $item.find('creator').text().trim() || $item.find('author').text().trim(),
        category: $item.find('category').first().text().trim()
      });
    });
    
    return items;
  } catch (error) {
    console.error(`❌ Error parsing RSS feed ${url}:`, error.message);
    return [];
  }
}

/**
 * Scrape UNILAG news page
 */
async function scrapeUNILAGNews() {
  try {
    const response = await axios.get('https://unilag.edu.ng/category/news/', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AI-UniPod-NewsBot/1.0)'
      }
    });
    
    const $ = cheerio.load(response.data);
    const articles = [];
    
    // Adjust selectors based on actual UNILAG website structure
    $('.post, article, .news-item').each((i, elem) => {
      const $article = $(elem);
      
      const title = $article.find('h2, h3, .entry-title, .post-title').first().text().trim();
      const link = $article.find('a').first().attr('href');
      const excerpt = $article.find('.excerpt, .entry-summary, p').first().text().trim();
      const image = $article.find('img').first().attr('src');
      const date = $article.find('.date, time, .published').first().text().trim();
      
      if (title && link) {
        articles.push({
          title,
          link: link.startsWith('http') ? link : `https://unilag.edu.ng${link}`,
          description: excerpt,
          image: image && image.startsWith('http') ? image : (image ? `https://unilag.edu.ng${image}` : ''),
          pubDate: date || new Date().toISOString(),
          author: 'UNILAG',
          category: 'University News'
        });
      }
    });
    
    return articles;
  } catch (error) {
    console.error('❌ Error scraping UNILAG news:', error.message);
    return [];
  }
}

/**
 * Fetch from NewsAPI with AI UniPod keywords
 */
async function fetchNewsAPI() {
  const apiKey = process.env.NEWS_API_KEY;
  
  if (!apiKey) {
    console.log('⚠️  NEWS_API_KEY not set, skipping NewsAPI');
    return [];
  }

  const queries = [
    '"AI UniPod" Lagos',
    'UNILAG artificial intelligence',
    'University of Lagos innovation',
    'Nigeria AI startups UNDP',
    'Timbuktoo initiative Nigeria'
  ];

  const articles = [];

  for (const query of queries) {
    try {
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: query,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 5,
          apiKey: apiKey
        }
      });

      if (response.data.articles) {
        articles.push(...response.data.articles.map(a => ({
          title: a.title,
          link: a.url,
          description: a.description,
          image: a.urlToImage,
          pubDate: a.publishedAt,
          author: a.author || a.source.name,
          category: 'External News'
        })));
      }
    } catch (error) {
      console.error(`❌ NewsAPI error for "${query}":`, error.message);
    }
  }

  return articles;
}

/**
 * Filter articles relevant to AI UniPod
 */
function filterRelevantArticles(articles) {
  const keywords = [
    'ai unipod', 'unilag', 'university of lagos',
    'artificial intelligence', 'innovation', 'startup',
    'undp', 'timbuktoo', 'nigeria ai', 'lagos tech'
  ];

  return articles.filter(article => {
    const text = `${article.title} ${article.description}`.toLowerCase();
    return keywords.some(keyword => text.includes(keyword));
  });
}

/**
 * Convert to mock-data format
 */
function convertToMockFormat(articles) {
  return articles.map((article, index) => {
    const date = new Date(article.pubDate);
    const validDate = isNaN(date.getTime()) ? new Date() : date;

    return {
      id: `auto-${Date.now()}-${index}`,
      title: article.title.substring(0, 200),
      slug: article.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 100),
      excerpt: article.description ? article.description.substring(0, 300) : '',
      content: `<p>${article.description || ''}</p><p><a href="${article.link}" target="_blank" rel="noopener noreferrer">Read full article →</a></p>`,
      cover_image: article.image || '',
      category: article.category || 'News',
      author: article.author || 'AI UniPod Team',
      published_date: validDate.toISOString(),
      published: true,
      featured: false,
      tags: ['AI', 'Innovation', 'UNILAG'],
      source_url: article.link
    };
  });
}

/**
 * Update mock-data.js
 */
function updateMockData(newArticles) {
  try {
    let content = fs.readFileSync(MOCK_DATA_PATH, 'utf8');
    
    // Find MOCK_NEWS array
    const newsRegex = /const\s+MOCK_NEWS\s*=\s*(\[[\s\S]*?\n\];)/;
    const match = content.match(newsRegex);
    
    if (!match) {
      console.error('❌ Could not find MOCK_NEWS array');
      return false;
    }

    // Parse existing news
    let existingNews = [];
    try {
      const newsStr = match[1].replace(/\n\];$/, ']');
      existingNews = eval(newsStr);
    } catch (e) {
      console.warn('⚠️  Starting with empty news array');
    }

    // Merge (avoid duplicates by title)
    const existingTitles = new Set(existingNews.map(n => n.title));
    const toAdd = newArticles.filter(a => !existingTitles.has(a.title));

    if (toAdd.length === 0) {
      console.log('ℹ️  No new articles to add');
      return false;
    }

    // Combine and sort
    const updated = [...toAdd, ...existingNews]
      .sort((a, b) => new Date(b.published_date) - new Date(a.published_date))
      .slice(0, 50);

    // Replace in file
    const newsArrayStr = JSON.stringify(updated, null, 2);
    const newContent = content.replace(
      newsRegex,
      `const MOCK_NEWS = ${newsArrayStr};`
    );

    fs.writeFileSync(MOCK_DATA_PATH, newContent, 'utf8');
    console.log(`✅ Added ${toAdd.length} new articles`);
    return true;

  } catch (error) {
    console.error('❌ Error updating mock-data:', error.message);
    return false;
  }
}

/**
 * Main
 */
async function main() {
  console.log('🚀 AI UniPod News Scraper Starting...\n');

  try {
    // Fetch from all sources
    console.log('📰 Fetching from sources...');
    const [rssArticles, scrapedArticles, newsApiArticles] = await Promise.all([
      parseRSSFeed('https://unilag.edu.ng/feed/'),
      scrapeUNILAGNews(),
      fetchNewsAPI()
    ]);

    const allArticles = [...rssArticles, ...scrapedArticles, ...newsApiArticles];
    console.log(`📊 Found ${allArticles.length} articles`);

    // Filter relevant
    const relevant = filterRelevantArticles(allArticles);
    console.log(`✨ ${relevant.length} relevant articles`);

    if (relevant.length === 0) {
      console.log('⚠️  No relevant articles found');
      return;
    }

    // Convert and update
    const formatted = convertToMockFormat(relevant);
    const updated = updateMockData(formatted);

    console.log(updated ? '\n✅ Success!' : '\nℹ️  No updates');

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
