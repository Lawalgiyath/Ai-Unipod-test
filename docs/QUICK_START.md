# Quick Start Guide - AI UniPod Lagos Website

## Current Status: Using Mock Data ✅

Your website is currently running with **mock data** (fake data stored in `js/mock-data.js`). This means:
- ✅ Website works immediately without any setup
- ✅ All pages load correctly (news, events, programs, gallery)
- ✅ No backend required
- ❌ Changes are not saved (refresh = data resets)
- ❌ Admin panel won't persist changes

## Option 1: Keep Using Mock Data (Easiest)

**Perfect for:** Testing, development, demo purposes

**What you have:**
- All pages work
- Sample content displays correctly
- No setup required

**To customize the content:**
1. Open `js/mock-data.js`
2. Edit the data objects (news, events, programs, etc.)
3. Save and refresh your browser

## Option 2: Switch to Real Supabase Backend (Recommended for Production)

**Perfect for:** Production website, real content management, multiple admins

**Benefits:**
- ✅ Real database (data persists)
- ✅ Admin panel works fully
- ✅ Multiple users can manage content
- ✅ File uploads
- ✅ Real-time updates
- ✅ Scalable and secure

**Setup Time:** ~15 minutes

### Quick Setup Steps:

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up (free tier available)
   - Create a new project

2. **Run the SQL Setup**
   - Open `SUPABASE_SETUP.md`
   - Copy the SQL from "Step 3"
   - Paste in Supabase SQL Editor
   - Click "Run"

3. **Get Your Credentials**
   - In Supabase: Settings > API
   - Copy your Project URL and anon key

4. **Update Configuration**
   - Open `js/supabase-client.js`
   - Replace line 4: `const SUPABASE_URL = 'YOUR_URL_HERE';`
   - Replace line 5: `const SUPABASE_ANON_KEY = 'YOUR_KEY_HERE';`

5. **Enable Supabase in HTML Files**
   
   In `index.html`, `news.html`, `events.html`, `programs.html`, `gallery.html`, `partners.html`:
   
   **Change from:**
   ```html
   <!-- Mock Data -->
   <script src="js/mock-data.js"></script>
   
   <!-- Supabase (uncomment when configured)
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   <script src="js/supabase-client.js"></script>
   -->
   ```
   
   **To:**
   ```html
   <!-- Supabase Backend -->
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   <script src="js/supabase-client.js"></script>
   ```

6. **Done!** 🎉
   - Refresh your website
   - Check browser console for "✅ Supabase client initialized"
   - Go to `admin.html` to manage content

## Testing Your Setup

### If using Mock Data:
1. Open `index.html` in browser
2. Check console: Should see "✅ Mock data loaded"
3. Navigate to News, Events, Programs - all should load

### If using Supabase:
1. Open `index.html` in browser
2. Check console: Should see "✅ Supabase client initialized"
3. Navigate to News, Events, Programs - should load from database
4. Go to `admin.html` - should be able to add/edit/delete content

## Troubleshooting

### "Unable to load programs/news/events"

**If using Mock Data:**
- Check that `js/mock-data.js` is loaded before `js/main.js`
- Check browser console for errors

**If using Supabase:**
- Verify credentials in `js/supabase-client.js`
- Check Supabase dashboard: Tables should exist
- Check browser console for connection errors
- Verify you ran the SQL setup script

### Admin panel not working

**If using Mock Data:**
- Mock data doesn't persist changes (this is expected)
- Switch to Supabase for real admin functionality

**If using Supabase:**
- Create admin user in Supabase: Authentication > Users
- Log in with those credentials
- Check browser console for auth errors

## Need Help?

1. Check `SUPABASE_SETUP.md` for detailed Supabase setup
2. Check browser console (F12) for error messages
3. Verify all script tags are in correct order in HTML files

## File Structure

```
├── index.html              # Homepage
├── news.html              # News page
├── events.html            # Events page
├── programs.html          # Programs page
├── gallery.html           # Gallery page
├── partners.html          # Partners page
├── admin.html             # Admin panel (requires Supabase)
├── js/
│   ├── config.js          # Configuration
│   ├── mock-data.js       # Mock data (for testing)
│   ├── supabase-client.js # Supabase backend
│   ├── main.js            # Core functionality
│   └── home.js            # Homepage specific
├── css/
│   ├── style.css          # Global styles
│   └── home.css           # Homepage styles
├── SUPABASE_SETUP.md      # Detailed Supabase guide
└── QUICK_START.md         # This file
```

## What's Next?

- ✅ Website is working with official UniPods branding
- ✅ All pages load correctly
- 🔄 Choose: Keep mock data OR set up Supabase (15 min)
- 📝 Customize content in `js/mock-data.js` OR via admin panel
- 🚀 Deploy to hosting (Netlify, Vercel, GitHub Pages)
