#!/usr/bin/env node

/**
 * Simple news updater that works with current mock-data.js structure
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.NEWS_API_KEY || '6754ddf1929a4cf1b9de92d391eb753a';
const MOCK_DATA_PATH = path.join(__dirname, '../frontend/js/mock-data.js');

async function fetchNews() {
  console.log('🚀 Fetching news about AI UniPod, UNILAG, Nigeria AI...\n');

  const queries = [
    'UNILAG OR "University of Lagos"',
    '"Nigeria AI" OR "Nigerian artificial intelligence"',
    '"AI innovation Nigeria"'
  ];

  const allArticles = [];

  for (const query of queries) {
    try {
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: query,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 5,
          apiKey: API_KEY
        }
      });

      if (response.data.articles) {
        allArticles.push(...response.data.articles);
      }
    } catch (error) {
      console.error(`❌ Error fetching "${query}":`, error.message);
    }
  }

  console.log(`📊 Found ${allArticles.length} total articles`);
  return allArticles;
}

function filterRelevant(articles) {
  const keywords = ['unilag', 'university of lagos', 'nigeria', 'ai', 'artificial intelligence', 'innovation', 'technology', 'startup'];
  
  return articles.filter(article => {
    const text = `${article.title} ${article.description || ''}`.toLowerCase();
    return keywords.some(keyword => text.includes(keyword));
  });
}

function convertToFormat(articles) {
  return articles.map((article, index) => {
    const date = new Date(article.publishedAt);
    return {
      id: `auto-${Date.now()}-${index}`,
      title: article.title.substring(0, 200),
      slug: article.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 100),
      excerpt: article.description ? article.description.substring(0, 300) : '',
      body: `<p>${article.description || ''}</p><p><a href="${article.url}" target="_blank" rel="noopener">Read full article →</a></p>`,
      cover_image: article.urlToImage || '',
      category: 'News',
      published_date: date.toISOString(),
      featured: false,
      published: true
    };
  });
}

function updateMockData(newArticles) {
  try {
    console.log('\n📝 Updating mock-data.js...');
    
    let content = fs.readFileSync(MOCK_DATA_PATH, 'utf8');
    
    // Find the news array in the data object
    const newsArrayMatch = content.match(/news:\s*\[([\s\S]*?)\n\s*\],\s*events:/);
    
    if (!newsArrayMatch) {
      console.error('❌ Could not find news array in mock-data.js');
      return false;
    }

    // Parse existing news
    let existingNews = [];
    try {
      const newsStr = '[' + newsArrayMatch[1] + ']';
      existingNews = eval(newsStr);
    } catch (e) {
      console.warn('⚠️  Could not parse existing news');
    }

    // Filter out duplicates
    const existingTitles = new Set(existingNews.map(n => n.title));
    const toAdd = newArticles.filter(a => !existingTitles.has(a.title));

    if (toAdd.length === 0) {
      console.log('ℹ️  No new articles to add');
      return false;
    }

    // Merge and limit to 20 articles
    const updated = [...toAdd, ...existingNews].slice(0, 20);

    // Convert to formatted string
    const newsArrayStr = updated.map(article => {
      return `      ${JSON.stringify(article, null, 6).replace(/\n/g, '\n      ')}`;
    }).join(',\n');

    // Replace in content
    const newContent = content.replace(
      /news:\s*\[[\s\S]*?\n\s*\],\s*events:/,
      `news: [\n${newsArrayStr}\n    ],\n    events:`
    );

    fs.writeFileSync(MOCK_DATA_PATH, newContent, 'utf8');
    console.log(`✅ Added ${toAdd.length} new articles!`);
    return true;

  } catch (error) {
    console.error('❌ Error updating mock-data.js:', error.message);
    return false;
  }
}

async function main() {
  try {
    const articles = await fetchNews();
    
    if (articles.length === 0) {
      console.log('⚠️  No articles found');
      return;
    }

    const relevant = filterRelevant(articles);
    console.log(`✨ ${relevant.length} relevant articles`);

    if (relevant.length === 0) {
      console.log('⚠️  No relevant articles found');
      return;
    }

    const formatted = convertToFormat(relevant);
    const updated = updateMockData(formatted);

    if (updated) {
      console.log('\n✅ Success! News updated.');
      console.log('Check frontend/js/mock-data.js to see new articles');
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
