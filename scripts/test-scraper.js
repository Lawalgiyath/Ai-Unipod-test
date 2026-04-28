#!/usr/bin/env node

/**
 * Simple test scraper to verify setup
 */

const axios = require('axios');

const API_KEY = process.env.NEWS_API_KEY || '6754ddf1929a4cf1b9de92d391eb753a';

async function testScraper() {
  console.log('🧪 Testing News Scraper...\n');
  
  if (!API_KEY || API_KEY === 'your_newsapi_key_here') {
    console.error('❌ No valid API key found!');
    console.log('Set NEWS_API_KEY environment variable or create .env file');
    process.exit(1);
  }

  console.log('✅ API Key found');
  console.log('🔍 Fetching news about AI UniPod...\n');

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'UNILAG OR "University of Lagos" OR "Nigeria AI"',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 5,
        apiKey: API_KEY
      }
    });

    if (response.data.status === 'ok') {
      console.log(`✅ Success! Found ${response.data.totalResults} articles\n`);
      
      if (response.data.articles.length > 0) {
        console.log('📰 Sample articles:\n');
        response.data.articles.slice(0, 3).forEach((article, i) => {
          console.log(`${i + 1}. ${article.title}`);
          console.log(`   Source: ${article.source.name}`);
          console.log(`   Date: ${new Date(article.publishedAt).toLocaleDateString()}`);
          console.log(`   URL: ${article.url}\n`);
        });
      } else {
        console.log('⚠️  No articles found. Try different keywords.');
      }

      console.log('\n✅ Scraper is working correctly!');
      console.log('Next step: Run full scraper with: npm run scrape:news');
      
    } else {
      console.error('❌ API returned error:', response.data.message);
    }

  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.data.message || error.response.statusText);
      if (error.response.status === 401) {
        console.log('\n💡 Your API key may be invalid. Check at: https://newsapi.org/account');
      }
    } else {
      console.error('❌ Network Error:', error.message);
    }
    process.exit(1);
  }
}

testScraper();
