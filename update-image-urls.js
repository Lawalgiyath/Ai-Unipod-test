const fs = require('fs');
const path = require('path');

// Read the Cloudinary mapping
const mapping = JSON.parse(fs.readFileSync('cloudinary-mapping.json', 'utf8'));

// Function to update image URLs in HTML files
function updateHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Replace all local image paths with Cloudinary URLs
  Object.keys(mapping).forEach(localPath => {
    const cloudinaryUrl = mapping[localPath];
    
    // Handle different path formats
    const patterns = [
      localPath,
      localPath.replace('frontend/', ''),
      localPath.replace('frontend/images/', 'images/'),
      '../' + localPath.replace('frontend/', '')
    ];
    
    patterns.forEach(pattern => {
      const regex = new RegExp(`src=["']${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
      if (content.match(regex)) {
        content = content.replace(regex, `src="${cloudinaryUrl}"`);
        updated = true;
      }
    });
  });
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${filePath}`);
    return true;
  }
  
  return false;
}

// Function to get all HTML files
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

// Main function
function updateAllHtmlFiles() {
  console.log('🔄 Updating HTML files with Cloudinary URLs...\n');
  
  const htmlFiles = getAllHtmlFiles('frontend');
  let updatedCount = 0;
  
  htmlFiles.forEach(file => {
    if (updateHtmlFile(file)) {
      updatedCount++;
    }
  });
  
  console.log(`\n✅ Updated ${updatedCount} HTML files`);
}

// Run the update
updateAllHtmlFiles();
