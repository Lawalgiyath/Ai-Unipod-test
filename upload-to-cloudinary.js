const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dxeddg9wf',
  api_key: '649538845432527',
  api_secret: 'LkryoKD1FMFgEmhdr8hC_4FmnHU'
});

// Function to get all image files recursively
function getAllImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllImages(filePath, fileList);
    } else if (/\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to upload image to Cloudinary
async function uploadImage(filePath) {
  try {
    // Create folder structure in Cloudinary matching local structure
    const relativePath = path.relative('frontend/images', filePath);
    const folder = path.dirname(relativePath).replace(/\\/g, '/');
    const publicId = path.basename(filePath, path.extname(filePath));
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder === '.' ? 'unipod' : `unipod/${folder}`,
      public_id: publicId,
      resource_type: 'auto',
      overwrite: true
    });
    
    console.log(`✓ Uploaded: ${filePath} -> ${result.secure_url}`);
    return {
      localPath: filePath,
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error(`✗ Failed to upload ${filePath}:`, error.message);
    return null;
  }
}

// Main upload function
async function uploadAllImages() {
  console.log('🚀 Starting Cloudinary upload...\n');
  
  const imageDir = 'frontend/images';
  const images = getAllImages(imageDir);
  
  console.log(`Found ${images.length} images to upload\n`);
  
  const results = [];
  
  for (const imagePath of images) {
    const result = await uploadImage(imagePath);
    if (result) {
      results.push(result);
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Save mapping to JSON file
  const mapping = {};
  results.forEach(r => {
    const relativePath = path.relative('frontend', r.localPath).replace(/\\/g, '/');
    mapping[relativePath] = r.cloudinaryUrl;
  });
  
  fs.writeFileSync('cloudinary-mapping.json', JSON.stringify(mapping, null, 2));
  
  console.log(`\n✅ Upload complete! ${results.length} images uploaded`);
  console.log('📄 URL mapping saved to cloudinary-mapping.json');
}

// Run the upload
uploadAllImages().catch(console.error);
