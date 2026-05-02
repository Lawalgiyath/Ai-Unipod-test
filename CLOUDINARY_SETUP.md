# Cloudinary Image Hosting Setup

## Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com/users/register_free
2. Sign up for a free account
3. After login, go to Dashboard
4. Copy these credentials:
   - **Cloud Name** (e.g., `dxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

## Step 2: Install Cloudinary Package

```bash
npm install cloudinary
```

## Step 3: Set Environment Variables

Create a `.env` file in the root directory:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**OR** edit `upload-to-cloudinary.js` and replace:
- `YOUR_CLOUD_NAME` with your cloud name
- `YOUR_API_KEY` with your API key
- `YOUR_API_SECRET` with your API secret

## Step 4: Upload Images to Cloudinary

```bash
node upload-to-cloudinary.js
```

This will:
- Upload all images from `frontend/images/` to Cloudinary
- Create a `cloudinary-mapping.json` file with URL mappings

## Step 5: Update HTML Files

```bash
node update-image-urls.js
```

This will:
- Replace all local image paths with Cloudinary URLs in all HTML files
- Update `frontend/*.html` files automatically

## Step 6: Commit and Push

```bash
git add .
git commit -m "Migrate images to Cloudinary CDN"
git push origin main
```

## Benefits

✅ **Faster Loading**: Images served from global CDN
✅ **Automatic Optimization**: Cloudinary optimizes images automatically
✅ **Smaller Repo Size**: Remove local images from repo
✅ **Image Transformations**: Resize, crop, format conversion on-the-fly
✅ **Free Tier**: 25GB storage, 25GB bandwidth/month

## Optional: Remove Local Images

After confirming everything works:

```bash
# Backup first!
git add .
git commit -m "Backup before removing local images"

# Remove local images
rm -rf frontend/images/*
rm -rf images/*

git add .
git commit -m "Remove local images - now using Cloudinary CDN"
git push origin main
```

This will reduce your repo size significantly!
