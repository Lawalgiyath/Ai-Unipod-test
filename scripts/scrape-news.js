#!/usr/bin/env node

/**
 * AI UniPod News Scraper
 * Automatically fetches news about AI UniPod from multiple sources
 * and updates the mock-data.js file
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const NEWS_SOURCES = {
  newsapi: {
    enabled: true,
    apiKey: process.env.NEWS_API_KEY,
    endpoint: 'https://newsapi.org/v2/everything',
    queries: [
      'AI UniPod Lagos',
      'UNILAG AI Innovation',
      'University of Lagos AI',
      'Nigeria AI startups UNDP'
    ]
  },
  unilag: {
    enabled: true,
    url: 'https://unilag.edu.ng',
    rssFeeds: [
      'https://unilag.edu.ng/feed/',
      'https://unilag.edu.ng/category/news/feed/'
    ]
  }
};

const MOCK_DATA_PATH = path.join(__dirname, '../frontend/js/mock-data.js');

/**
 * Fetch news from NewsAPI
 */
async function fetchFromNewsAPI() {
  if (!NEWS_SOURCES.newsapi.enabled || !NEWS_SOURCES.newsapi.apiKey) {
    console.log('⚠️  NewsAPI disabled or no API key provided');
    return [];
  }

  const articles = [];
  
  for (const query of NEWS_SOURCES.newsapi.queries) {
    try {
      const response = await axios.get(NEWS_SOURCES.newsapi.endpoint, {
        params: {
          q: query,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 10,
          apiKey: NEWS_SOURCES.newsapi.apiKey
        }
      });

      if (response.data.articles) {
        articles.push(...response.data.articles.map(article => ({
          source: 'NewsAPI',
          title: article.title,
          description: article.description,
          url: article.url,
          image: article.urlToImage,
          publishedAt: article.publishedAt,
          author: article.author || article.source.name
        })));
      }
    } catch (error) {
      console.error(`❌ Error fetching from NewsAPI (${query}):`, error.message);
    }
  }

  return articles;
}

/**
 * Fetch news from UNILAG website
 */
async function fetchFromUNILAG() {
  if (!NEWS_SOURCES.unilag.enabled) {
    console.log('⚠️  UNILAG scraping disabled');
    return [];
  }

  const articles = [];

  try {
    // Scrape UNILAG news page
    const response = await axios.get('https://unilag.edu.ng/category/news/', {
      timeout: 10000
    });

    // Basic HTML parsing (you can enhance this with cheerio)
    const html = response.data;
    
    // This is a simplified example - you'd want to use cheerio for proper parsing
    console.log('✅ Fetched UNILAG news page');
    
  } catch (error) {
    console.error('❌ Error fetching from UNILAG:', error.message);
  }

  return articles;
}

/**
 * Filter and deduplicate articles
 */
function processArticles(articles) {
  // Remove duplicates based on title similarity
  const seen = new Set();
  const filtered = [];

  for (const article of articles) {
    const normalizedTitle = article.title.toLowerCase().trim();
    
    if (!seen.has(normalizedTitle)) {
      seen.add(normalizedTitle);
      filtered.push(article);
    }
  }

  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  // Take top 20
  return filtered.slice(0, 20);
}

/**
 * Convert articles to mock-data format
 */
function convertToMockDataFormat(articles) {
  return articles.map((article, index) => ({
    id: `news-${Date.now()}-${index}`,
    title: article.title,
    slug: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    excerpt: article.description || '',
    content: `<p>${article.description || ''}</p><p><a href="${article.url}" target="_blank" rel="noopener">Read full article →</a></p>`,
    cover_image: article.image || '',
    category: 'News',
    author: article.author || 'AI UniPod Team',
    published_date: article.publishedAt,
    published: true,
    featured: false,
    tags: ['AI', 'Innovation', 'UNILAG']
  }));
}

/**
 * Update mock-data.js file
 */
function updateMockData(newArticles) {
  try {
    // Read existing mock-data.js
    let mockDataContent = fs.readFileSync(MOCK_DATA_PATH, 'utf8');

    // Extract existing news array
    const newsMatch = mockDataContent.match(/const\s+MOCK_NEWS\s*=\s*(\[[\s\S]*?\]);/);
    
    if (!newsMatch) {
      console.error('❌ Could not find MOCK_NEWS in mock-data.js');
      return false;
    }

    // Parse existing news
    let existingNews = [];
    try {
      // Remove the const declaration and eval the array
      const newsArrayStr = newsMatch[1];
      existingNews = eval(newsArrayStr);
    } catch (e) {
      console.warn('⚠️  Could not parse existing news, starting fresh');
      existingNews = [];
    }

    // Merge new articles with existing (avoid duplicates by title)
    const existingTitles = new Set(existingNews.map(n => n.title));
    const articlesToAdd = newArticles.filter(a => !existingTitles.has(a.title));

    if (articlesToAdd.length === 0) {
      console.log('ℹ️  No new articles to add');
      return false;
    }

    // Combine and limit to 50 most recent
    const updatedNews = [...articlesToAdd, ...existingNews]
      .sort((a, b) => new Date(b.published_date) - new Date(a.published_date))
      .slice(0, 50);

    // Generate new mock-data content
    const newsArrayStr = JSON.stringify(updatedNews, null, 2);
    const newMockDataContent = mockDataContent.replace(
      /const\s+MOCK_NEWS\s*=\s*\[[\s\S]*?\];/,
      `const MOCK_NEWS = ${newsArrayStr};`
    );

    // Write back to file
    fs.writeFileSync(MOCK_DATA_PATH, newMockDataContent, 'utf8');
    
    console.log(`✅ Added ${articlesToAdd.length} new articles to mock-data.js`);
    return true;

  } catch (error) {
    console.error('❌ Error updating mock-data.js:', error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting AI UniPod News Scraper...\n');

  try {
    // Fetch from all sources
    console.log('📰 Fetching news from sources...');
    const [newsApiArticles, unilagArticles] = await Promise.all([
      fetchFromNewsAPI(),
      fetchFromUNILAG()
    ]);

    // Combine all articles
    const allArticles = [...newsApiArticles, ...unilagArticles];
    console.log(`\n📊 Found ${allArticles.length} total articles`);

    if (allArticles.length === 0) {
      console.log('⚠️  No articles found. Exiting.');
      return;
    }

    // Process articles
    const processedArticles = processArticles(allArticles);
    console.log(`✨ Processed ${processedArticles.length} unique articles`);

    // Convert to mock-data format
    const mockDataArticles = convertToMockDataFormat(processedArticles);

    // Update mock-data.js
    const updated = updateMockData(mockDataArticles);

    if (updated) {
      console.log('\n✅ News scraping completed successfully!');
    } else {
      console.log('\nℹ️  No updates needed');
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
