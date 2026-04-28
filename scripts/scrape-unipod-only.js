#!/usr/bin/env node

/**
 * STRICT AI UniPod News Scraper
 * ONLY scrapes articles specifically about AI UniPod
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const MOCK_DATA_PATH = path.join(__dirname, '../frontend/js/mock-data.js');

// ONLY articles specifically about AI UniPod
const VERIFIED_UNIPOD_ARTICLES = [
  'https://unilag.edu.ng/unilag-leads-nigerias-ai-future-with-first-ai-unipod-commissioning-showcasing-student-innovation/',
  'https://www.undp.org/nigeria/press-releases/nigeria-unveils-national-unipod-network-power-jobs-innovation-and-competitiveness-vice-president-flag-ai-unipod-university',
  'https://www.nuc.edu.ng/fg-undp-unveil-unipod-to-drive-n30bn-innovation-ecosystem-in-unilag/',
  'https://unilag.edu.ng/unilag-leads-nigerias-innovation-drive-with-launch-of-ai-focused-unipod/',
  'https://unilag.edu.ng/professor-yinka-banjo-becomes-pioneer-director-ai-unipod-unilag/',
  'https://unilag.edu.ng/unilag-ai-unipod-launch-traffic-advisory/',
  'https://unilag.edu.ng/event/unilag-ai-unipod-open-day-for-students-staff-holds-march-12/'
];

async function scrapeArticle(url) {
  try {
    console.log(`📄 Scraping: ${url.substring(0, 80)}...`);
    
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

    // Title
    title = $('h1.entry-title').first().text().trim() ||
            $('h1').first().text().trim() ||
            $('title').text().trim().split('|')[0].trim();

    // STRICT CHECK: Title MUST contain "unipod" or "UniPod"
    if (!title.toLowerCase().includes('unipod')) {
      console.log(`   ⚠️  Skipping - title doesn't mention UniPod: ${title}`);
      return null;
    }

    // Excerpt
    excerpt = $('meta[name="description"]').attr('content') ||
              $('meta[property="og:description"]').attr('content') ||
              $('.entry-content p').first().text().trim().substring(0, 300) ||
              $('p').first().text().trim().substring(0, 300);

    // Content - get first few paragraphs only
    const paragraphs = [];
    $('.entry-content p, article p, .post-content p').each((i, elem) => {
      if (i < 5) { // Only first 5 paragraphs
        const text = $(elem).text().trim();
        if (text.length > 50) {
          paragraphs.push(`<p>${text}</p>`);
        }
      }
    });
    content = paragraphs.join('\n');

    if (!content) {
      content = `<p>${excerpt}</p>`;
    }

    // Add source link at the end - make it prominent
    content += `\n\n<p style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #E8E5DF;"><strong><a href="${url}" target="_blank" rel="noopener" style="color: #1E84C2; text-decoration: none;">Read full article on ${new URL(url).hostname} →</a></strong></p>`;

    // Image
    image = $('meta[property="og:image"]').attr('content') ||
            $('.wp-post-image').attr('src') ||
            $('article img').first().attr('src') ||
            '';

    // Make image URL absolute
    if (image && !image.startsWith('http')) {
      const base = new URL(url).origin;
      image = new URL(image, base).href;
    }

    // Date
    const dateStr = $('time').attr('datetime') ||
                   $('meta[property="article:published_time"]').attr('content') ||
                   $('.entry-date').text().trim();
    
    if (dateStr) {
      try {
        date = new Date(dateStr).toISOString();
      } catch (e) {
        // Keep default
      }
    }

    // FINAL CHECK: Content must mention UniPod
    const fullText = `${title} ${excerpt} ${content}`.toLowerCase();
    if (!fullText.includes('unipod') && !fullText.includes('uni pod')) {
      console.log(`   ⚠️  Skipping - content doesn't mention UniPod`);
      return null;
    }

    console.log(`   ✅ Valid UniPod article: ${title.substring(0, 60)}...`);

    return {
      url,
      title,
      excerpt,
      content,
      image,
      date,
      source: new URL(url).hostname
    };

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return null;
  }
}

async function searchUNILAGForUnipod() {
  try {
    console.log('\n🔍 Searching UNILAG for UniPod articles...');
    
    const searchUrl = 'https://unilag.edu.ng/?s=AI+UniPod';
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
      
      // STRICT: Link text or href must contain "unipod"
      if (href && (text.includes('unipod') || href.includes('unipod'))) {
        if (href.startsWith('https://unilag.edu.ng/') && 
            !href.includes('?s=') && 
            !href.includes('#')) {
          links.push(href);
        }
      }
    });

    const unique = [...new Set(links)];
    console.log(`   Found ${unique.length} potential UniPod article URLs`);
    return unique;

  } catch (error) {
    console.error(`   ❌ Error searching: ${error.message}`);
    return [];
  }
}

function convertToFormat(articles) {
  return articles.map((article, index) => ({
    id: `unipod-${Date.now()}-${index}`,
    title: article.title.substring(0, 200),
    slug: article.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 100),
    excerpt: article.excerpt,
    body: article.content,
    cover_image: article.image,
    category: 'AI UniPod News',
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
    
    const newsArrayMatch = content.match(/news:\s*\[([\s\S]*?)\n\s*\],\s*events:/);
    
    if (!newsArrayMatch) {
      console.error('❌ Could not find news array');
      return false;
    }

    let existingNews = [];
    try {
      const newsStr = '[' + newsArrayMatch[1] + ']';
      existingNews = eval(newsStr);
    } catch (e) {
      console.warn('⚠️  Could not parse existing news');
    }

    // Remove duplicates by URL
    const existingUrls = new Set(existingNews.map(n => n.source_url).filter(Boolean));
    const toAdd = newArticles.filter(a => !existingUrls.has(a.source_url));

    if (toAdd.length === 0) {
      console.log('ℹ️  No new UniPod articles to add');
      return false;
    }

    // Merge - keep UniPod articles at top, limit to 25 total
    const updated = [...toAdd, ...existingNews].slice(0, 25);

    const newsArrayStr = updated.map(article => {
      return `      ${JSON.stringify(article, null, 6).replace(/\n/g, '\n      ')}`;
    }).join(',\n');

    const newContent = content.replace(
      /news:\s*\[[\s\S]*?\n\s*\],\s*events:/,
      `news: [\n${newsArrayStr}\n    ],\n    events:`
    );

    fs.writeFileSync(MOCK_DATA_PATH, newContent, 'utf8');
    console.log(`✅ Added ${toAdd.length} new AI UniPod articles!`);
    
    toAdd.forEach((article, i) => {
      console.log(`   ${i + 1}. ${article.title}`);
    });
    
    return true;

  } catch (error) {
    console.error('❌ Error updating mock-data.js:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 AI UniPod News Scraper (STRICT MODE)\n');
  console.log('Only scraping articles specifically about AI UniPod...\n');

  try {
    const allArticles = [];

    // Step 1: Scrape verified UniPod articles
    console.log('📰 Scraping verified AI UniPod articles...\n');
    
    for (const url of VERIFIED_UNIPOD_ARTICLES) {
      const article = await scrapeArticle(url);
      if (article) {
        allArticles.push(article);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\n✅ Scraped ${allArticles.length} verified articles`);

    // Step 2: Search UNILAG for more UniPod articles
    const foundUrls = await searchUNILAGForUnipod();
    
    if (foundUrls.length > 0) {
      console.log('\n📰 Scraping additional UniPod articles...\n');
      
      for (const url of foundUrls.slice(0, 10)) {
        if (!VERIFIED_UNIPOD_ARTICLES.includes(url)) {
          const article = await scrapeArticle(url);
          if (article) {
            allArticles.push(article);
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    console.log(`\n📊 Total valid AI UniPod articles: ${allArticles.length}`);

    if (allArticles.length === 0) {
      console.log('\n⚠️  No AI UniPod articles found');
      return;
    }

    const formatted = convertToFormat(allArticles);
    const updated = updateMockData(formatted);

    if (updated) {
      console.log('\n✅ Success! Only AI UniPod articles added.');
    } else {
      console.log('\nℹ️  No new articles (already have them)');
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
