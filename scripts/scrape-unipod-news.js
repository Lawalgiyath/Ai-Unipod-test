#!/usr/bin/env node

/**
 * Proper AI UniPod News Scraper
 * Scrapes actual articles from UNILAG, UNDP, NUC websites
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const MOCK_DATA_PATH = path.join(__dirname, '../frontend/js/mock-data.js');

// Known AI UniPod articles
const KNOWN_ARTICLES = [
  'https://unilag.edu.ng/unilag-leads-nigerias-ai-future-with-first-ai-unipod-commissioning-showcasing-student-innovation/',
  'https://www.undp.org/nigeria/press-releases/nigeria-unveils-national-unipod-network-power-jobs-innovation-and-competitiveness-vice-president-flag-ai-unipod-university',
  'https://www.nuc.edu.ng/fg-undp-unveil-unipod-to-drive-n30bn-innovation-ecosystem-in-unilag/'
];

// Search patterns for finding more articles
const SEARCH_URLS = [
  'https://unilag.edu.ng/?s=unipod',
  'https://unilag.edu.ng/?s=AI+innovation',
  'https://www.undp.org/nigeria/search?q=unipod',
  'https://www.nuc.edu.ng/?s=unipod'
];

async function scrapeArticle(url) {
  try {
    console.log(`📄 Scraping: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    // Extract article data
    let title = '';
    let excerpt = '';
    let content = '';
    let image = '';
    let date = new Date().toISOString();

    // Try different selectors for title
    title = $('h1.entry-title').first().text().trim() ||
            $('h1').first().text().trim() ||
            $('title').text().trim().split('|')[0].trim();

    // Try different selectors for excerpt/description
    excerpt = $('meta[name="description"]').attr('content') ||
              $('meta[property="og:description"]').attr('content') ||
              $('.entry-content p').first().text().trim().substring(0, 300) ||
              $('p').first().text().trim().substring(0, 300);

    // Get main content
    content = $('.entry-content').html() ||
              $('article').html() ||
              $('.post-content').html() ||
              '';

    // Get featured image
    image = $('meta[property="og:image"]').attr('content') ||
            $('.wp-post-image').attr('src') ||
            $('article img').first().attr('src') ||
            '';

    // Try to get publish date
    const dateStr = $('time').attr('datetime') ||
                   $('meta[property="article:published_time"]').attr('content') ||
                   $('.entry-date').text().trim();
    
    if (dateStr) {
      try {
        date = new Date(dateStr).toISOString();
      } catch (e) {
        // Keep default date
      }
    }

    // Clean up content
    if (content) {
      content = content.substring(0, 2000); // Limit content length
    }

    return {
      url,
      title,
      excerpt,
      content: content || `<p>${excerpt}</p>`,
      image,
      date,
      source: new URL(url).hostname
    };

  } catch (error) {
    console.error(`❌ Error scraping ${url}:`, error.message);
    return null;
  }
}

async function searchForArticles(searchUrl) {
  try {
    console.log(`🔍 Searching: ${searchUrl}`);
    
    const response = await axios.get(searchUrl, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const links = [];

    // Find article links
    $('a').each((i, elem) => {
      const href = $(elem).attr('href');
      const text = $(elem).text().toLowerCase();
      
      if (href && (text.includes('unipod') || text.includes('ai') || text.includes('innovation'))) {
        let fullUrl = href;
        if (!href.startsWith('http')) {
          const base = new URL(searchUrl).origin;
          fullUrl = new URL(href, base).href;
        }
        
        if (fullUrl.includes('unilag.edu.ng') || 
            fullUrl.includes('undp.org') || 
            fullUrl.includes('nuc.edu.ng')) {
          links.push(fullUrl);
        }
      }
    });

    return [...new Set(links)]; // Remove duplicates

  } catch (error) {
    console.error(`❌ Error searching ${searchUrl}:`, error.message);
    return [];
  }
}

function convertToFormat(articles) {
  return articles.map((article, index) => ({
    id: `scraped-${Date.now()}-${index}`,
    title: article.title.substring(0, 200),
    slug: article.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 100),
    excerpt: article.excerpt,
    body: article.content,
    cover_image: article.image,
    category: 'News',
    published_date: article.date,
    featured: false,
    published: true,
    source_url: article.url,
    source: article.source
  }));
}

function updateMockData(newArticles) {
  try {
    console.log('\n📝 Updating mock-data.js...');
    
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
      console.warn('⚠️  Could not parse existing news');
    }

    // Filter out duplicates by URL or title
    const existingUrls = new Set(existingNews.map(n => n.source_url).filter(Boolean));
    const existingTitles = new Set(existingNews.map(n => n.title));
    
    const toAdd = newArticles.filter(a => 
      !existingUrls.has(a.source_url) && !existingTitles.has(a.title)
    );

    if (toAdd.length === 0) {
      console.log('ℹ️  No new articles to add');
      return false;
    }

    // Merge and limit to 30 articles
    const updated = [...toAdd, ...existingNews].slice(0, 30);

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
    
    // Show what was added
    toAdd.forEach((article, i) => {
      console.log(`   ${i + 1}. ${article.title}`);
      console.log(`      Source: ${article.source}`);
    });
    
    return true;

  } catch (error) {
    console.error('❌ Error updating mock-data.js:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 AI UniPod News Scraper Starting...\n');

  try {
    // Step 1: Scrape known articles
    console.log('📰 Scraping known AI UniPod articles...\n');
    const knownArticlesData = [];
    
    for (const url of KNOWN_ARTICLES) {
      const article = await scrapeArticle(url);
      if (article && article.title) {
        knownArticlesData.push(article);
      }
      // Be nice to servers
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\n✅ Scraped ${knownArticlesData.length} known articles`);

    // Step 2: Search for more articles
    console.log('\n🔍 Searching for more AI UniPod articles...\n');
    const foundUrls = [];
    
    for (const searchUrl of SEARCH_URLS) {
      const urls = await searchForArticles(searchUrl);
      foundUrls.push(...urls);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const uniqueUrls = [...new Set(foundUrls)].slice(0, 10); // Limit to 10 additional
    console.log(`\n✅ Found ${uniqueUrls.length} additional article URLs`);

    // Step 3: Scrape found articles
    const foundArticlesData = [];
    for (const url of uniqueUrls) {
      if (!KNOWN_ARTICLES.includes(url)) {
        const article = await scrapeArticle(url);
        if (article && article.title) {
          foundArticlesData.push(article);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`\n✅ Scraped ${foundArticlesData.length} additional articles`);

    // Step 4: Combine and format
    const allArticles = [...knownArticlesData, ...foundArticlesData];
    
    if (allArticles.length === 0) {
      console.log('\n⚠️  No articles found');
      return;
    }

    console.log(`\n📊 Total articles: ${allArticles.length}`);

    const formatted = convertToFormat(allArticles);
    const updated = updateMockData(formatted);

    if (updated) {
      console.log('\n✅ Success! News updated with real AI UniPod articles.');
    } else {
      console.log('\nℹ️  No new articles to add (already have them)');
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
