# 🚀 Quick Start Guide — AI UniPod Lagos

Get your website up and running in 30 minutes!

---

## Step 1: Set Up Supabase (10 minutes)

### 1.1 Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name it "unipod-lagos"
4. Choose a region (closest to Nigeria)
5. Set a strong database password
6. Wait for project to initialize

### 1.2 Create Tables
1. Go to SQL Editor in Supabase dashboard
2. Copy the SQL from `DEPLOYMENT_GUIDE.md` (lines 15-90)
3. Paste and run the SQL
4. Verify tables are created in Table Editor

### 1.3 Get Credentials
1. Go to Project Settings → API
2. Copy "Project URL"
3. Copy "anon public" key
4. Keep these safe!

---

## Step 2: Configure Website (5 minutes)

### 2.1 Update Supabase Client
Open `js/supabase-client.js` and replace:

```javascript
const SUPABASE_URL = 'YOUR_PROJECT_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

With your actual credentials from Step 1.3

### 2.2 Test Locally
```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx serve

# Visit http://localhost:8000
```

---

## Step 3: Add Initial Content (10 minutes)

### 3.1 Access Admin Panel
1. Visit `http://localhost:8000/admin.html`
2. You should see the dashboard

### 3.2 Add Sample News Article
1. Click "News Articles" in sidebar
2. Click "+ Add Article"
3. Fill in:
   - Title: "AI UniPod Lagos Opens Its Doors"
   - Category: "Announcement"
   - Excerpt: "Nigeria's first AI-themed University Innovation Pod officially launches at UNILAG."
   - Body: Add a few paragraphs
   - Check "Published"
4. Click "Save Article"

### 3.3 Add Sample Event
1. Click "Events" in sidebar
2. Click "+ Add Event"
3. Fill in:
   - Title: "AI Innovation Bootcamp"
   - Category: "Bootcamp"
   - Date: Choose a future date
   - Location: "AI UniPod, UNILAG"
   - Check "Published"
4. Click "Save Event"

### 3.4 Add Sample Program
1. Click "Programs" in sidebar
2. Click "+ Add Program"
3. Fill in:
   - Title: "AI Solutions for Africa"
   - Subtitle: "Build AI solutions for African challenges"
   - Category: "AI Training"
   - Status: "Active"
   - Check "Published"
4. Click "Save Program"

---

## Step 4: Deploy to Production (5 minutes)

### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Follow prompts, done!
```

### Option B: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Follow prompts, done!
```

### Option C: GitHub Pages

1. Push code to GitHub
2. Go to repository Settings → Pages
3. Select branch and folder
4. Save and wait for deployment

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Homepage loads correctly
- [ ] News article appears on homepage
- [ ] Event appears on homepage
- [ ] Program appears on homepage
- [ ] Admin panel is accessible
- [ ] All pages load without errors
- [ ] Mobile view works correctly
- [ ] Images load properly
- [ ] WebGL animations work

---

## 🎉 You're Live!

Your AI UniPod Lagos website is now live! 

### Next Steps:
1. Add more content (20+ articles, 10+ events, 50+ photos)
2. Configure custom domain
3. Set up analytics
4. Share with stakeholders
5. Monitor performance

---

## 🆘 Troubleshooting

### "Supabase client not loaded"
- Check if Supabase CDN script is included in HTML
- Verify internet connection
- Check browser console for errors

### "Failed to fetch"
- Verify Supabase credentials are correct
- Check if tables exist in Supabase
- Verify RLS policies are enabled

### "Admin panel not working"
- Clear browser cache
- Check browser console for errors
- Verify Supabase connection

### WebGL not rendering
- Check if Three.js CDN is loaded
- Try different browser
- Check GPU acceleration is enabled

---

## 📞 Need Help?

- **Documentation**: See `DEPLOYMENT_GUIDE.md`
- **Content Guide**: See `CONTENT_FACTS.md`
- **Full README**: See `README.md`
- **Email**: tech@unipodlagos.ng

---

## 🎯 Pro Tips

1. **Use real images**: Replace placeholder images with actual photos
2. **Write compelling content**: Focus on impact stories
3. **Update regularly**: Add news weekly, events monthly
4. **Monitor analytics**: Track what content performs best
5. **Engage community**: Share on social media
6. **Backup regularly**: Export Supabase data monthly
7. **Test on mobile**: Most visitors will be on mobile
8. **Optimize images**: Use WebP format, compress files
9. **Check performance**: Run Lighthouse audits monthly
10. **Stay updated**: Keep dependencies current

---

*You're ready to showcase Africa's AI future! 🚀*
