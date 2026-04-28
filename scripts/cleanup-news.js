#!/usr/bin/env node

/**
 * Clean up mock-data.js - Remove non-UniPod articles
 */

const fs = require('fs');
const path = require('path');

const MOCK_DATA_PATH = path.join(__dirname, '../frontend/js/mock-data.js');

function cleanupNews() {
  console.log('🧹 Cleaning up news articles...\n');
  
  try {
    let content = fs.readFileSync(MOCK_DATA_PATH, 'utf8');
    
    // Find the news array
    const newsArrayMatch = content.match(/news:\s*\[([\s\S]*?)\n\s*\],\s*events:/);
    
    if (!newsArrayMatch) {
      console.error('❌ Could not find news array');
      return false;
    }

    // Parse existing news
    let existingNews = [];
    try {
      const newsStr = '[' + newsArrayMatch[1] + ']';
      existingNews = eval(newsStr);
    } catch (e) {
      console.error('❌ Could not parse news:', e.message);
      return false;
    }

    console.log(`📊 Found ${existingNews.length} total articles`);

    // Filter: Keep ONLY articles that mention "UniPod" in title
    const unipodArticles = existingNews.filter(article => {
      const title = article.title.toLowerCase();
      const hasUnipod = title.includes('unipod') || title.includes('uni pod');
      
      if (!hasUnipod) {
        console.log(`   ❌ Removing: ${article.title}`);
      }
      
      return hasUnipod;
    });

    console.log(`\n✅ Keeping ${unipodArticles.length} UniPod articles`);
    console.log(`🗑️  Removed ${existingNews.length - unipodArticles.length} irrelevant articles\n`);

    if (unipodArticles.length === existingNews.length) {
      console.log('ℹ️  All articles are already UniPod-related. No cleanup needed.');
      return false;
    }

    // Show what we're keeping
    console.log('📰 Keeping these articles:');
    unipodArticles.forEach((article, i) => {
      console.log(`   ${i + 1}. ${article.title}`);
    });

    // Convert to formatted string
    const newsArrayStr = unipodArticles.map(article => {
      return `      ${JSON.stringify(article, null, 6).replace(/\n/g, '\n      ')}`;
    }).join(',\n');

    // Replace in content
    const newContent = content.replace(
      /news:\s*\[[\s\S]*?\n\s*\],\s*events:/,
      `news: [\n${newsArrayStr}\n    ],\n    events:`
    );

    fs.writeFileSync(MOCK_DATA_PATH, newContent, 'utf8');
    console.log('\n✅ Cleanup complete!');
    return true;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

cleanupNews();
