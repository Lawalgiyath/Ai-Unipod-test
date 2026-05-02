const fs = require('fs');
const path = require('path');

// Cloudinary URLs for logos
const cloudinaryUrls = {
  'images/unipods Logo.png': 'https://res.cloudinary.com/dxeddg9wf/image/upload/f_auto,q_auto/unipod/unipods%20Logo.png',
  'images/undp_logo.png': 'https://res.cloudinary.com/dxeddg9wf/image/upload/f_auto,q_auto/unipod/undp_logo.png',
  'images/UNILAG LOGO.png': 'https://res.cloudinary.com/dxeddg9wf/image/upload/f_auto,q_auto/unipod/UNILAG%20LOGO.png',
  'images/Nigerias_Coat_of_arms.png': 'https://res.cloudinary.com/dxeddg9wf/image/upload/f_auto,q_auto/unipod/Nigerias_Coat_of_arms.png',
  'images/tetfund_logo.png': 'https://res.cloudinary.com/dxeddg9wf/image/upload/f_auto,q_auto/unipod/tetfund_logo.png',
  'images/africa-map.png': 'https://res.cloudinary.com/dxeddg9wf/image/upload/f_auto,q_auto/unipod/africa-map.png',
  'images/inside-unipod.jpg': 'https://res.cloudinary.com/dxeddg9wf/image/upload/f_auto,q_auto/unipod/inside-unipod.jpg',
  'images/unipod_front_view.jpeg': 'https://res.cloudinary.com/dxeddg9wf/image/upload/f_auto,q_auto/unipod/unipod_front_view.jpg',
  'images/adminster/Ahunna Eziakonwa.jpg': 'https://res.cloudinary.com/dxeddg9wf/image/upload/f_auto,q_auto/unipod/adminster/Ahunna%20Eziakonwa.jpg'
};

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

// Replace URLs in file
function replaceUrlsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  Object.keys(cloudinaryUrls).forEach(localPath => {
    const cloudinaryUrl = cloudinaryUrls[localPath];
    const regex = new RegExp(`src=["']${localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
    
    if (content.match(regex)) {
      content = content.replace(regex, `src="${cloudinaryUrl}"`);
      updated = true;
      console.log(`  ✓ Replaced ${localPath} in ${path.basename(filePath)}`);
    }
  });
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

// Main function
console.log('🚀 Replacing local image URLs with Cloudinary CDN...\n');

const htmlFiles = getAllHtmlFiles('frontend');
let updatedCount = 0;

htmlFiles.forEach(file => {
  if (replaceUrlsInFile(file)) {
    updatedCount++;
  }
});

console.log(`\n✅ Updated ${updatedCount} HTML files with Cloudinary CDN URLs`);
console.log('📦 Logos and key images now served from Cloudinary CDN');
console.log('🖼️  Gallery images remain local (will use GitHub CDN)');
