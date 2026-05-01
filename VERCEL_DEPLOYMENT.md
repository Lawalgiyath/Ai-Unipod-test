# Vercel Deployment Guide

## Quick Deploy

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Deploy to Production**
```bash
vercel --prod
```

### Option 2: Deploy via GitHub Integration

1. Go to https://vercel.com/new
2. Import your GitHub repository: `Lawalgiyath/Ai-Unipod-test`
3. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: (leave empty)
   - **Output Directory**: `frontend`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_KEY` - Your Supabase service key
   - `ADMIN_EMAIL` - admin@unipod.unilag.edu.ng

5. Click **Deploy**

## Configuration

The `vercel.json` file is already configured with:
- Static file serving from `frontend/` directory
- Serverless functions support (if needed later)
- Environment variables setup

## Custom Domain

After deployment, you can add your custom domain:
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add `unipodlagos.ng` or your preferred domain
4. Follow DNS configuration instructions

## Benefits of Vercel

✅ **Global CDN** - Automatic edge caching worldwide
✅ **Instant Deployments** - Deploy in seconds
✅ **Automatic HTTPS** - Free SSL certificates
✅ **Git Integration** - Auto-deploy on push to main
✅ **Zero Config** - Works out of the box
✅ **Analytics** - Built-in performance monitoring

## Deployment URL

After deployment, your site will be available at:
- Production: `https://ai-unipod.vercel.app` (or your custom domain)
- Preview: Unique URL for each branch/PR

## Troubleshooting

If images don't load:
- Check that Cloudinary URLs are working
- Verify environment variables are set
- Check Vercel deployment logs

## Comparison: Netlify vs Vercel

Both are excellent, but:
- **Vercel**: Faster builds, better Next.js support, cleaner UI
- **Netlify**: Better form handling, more generous free tier

You can keep both deployments active!
