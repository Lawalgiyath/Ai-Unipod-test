const fs = require('fs');
const path = require('path');

// GitHub CDN base URL
const GITHUB_CDN = 'https://raw.githubusercontent.com/Lawalgiyath/Ai-Unipod-test/main/frontend/images';

// Get all HTML files
function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      getAllHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Replace image URLs in file
function replaceImagesInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Replace all local image paths with GitHub CDN
  const patterns = [
    { regex: /src="images\//g, replacement: `src="${GITHUB_CDN}/` },
    { regex: /src='images\//g, replacement: `src='${GITHUB_CDN}/` },
    { regex: /src="\.\.\/images\//g, replacement: `src="${GITHUB_CDN}/` },
    { regex: /src='\.\.\/images\//g, replacement: `src='${GITHUB_CDN}/` }
  ];
  
  patterns.forEach(({ regex, replacement }) => {
    if (content.match(regex)) {
      content = content.replace(regex, replacement);
      updated = true;
    }
  });
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ Updated ${path.basename(filePath)}`);
    return true;
  }
  
  return false;
}

// Main function
console.log('🚀 Migrating all images to GitHub CDN...\n');

const htmlFiles = getAllHtmlFiles('frontend');
let updatedCount = 0;

htmlFiles.forEach(file => {
  if (replaceImagesInFile(file)) {
    updatedCount++;
  }
});

console.log(`\n✅ Updated ${updatedCount} HTML files`);
console.log(`📦 All images now served from GitHub CDN`);
console.log(`🔗 Base URL: ${GITHUB_CDN}`);
