# 🚀 START HERE - AI UniPod Lagos CMS

## Your CMS is Now Secure! 🔒

All security measures have been implemented. Follow these steps to deploy:

---

## Step 1: Generate Credentials (2 minutes)

**Windows:**
```cmd
scripts\generate-credentials.bat
```

**Mac/Linux:**
```bash
bash scripts/generate-credentials.sh
```

This will generate:
- Password hash (SHA-256)
- JWT secret (32-byte random)
- Save to `.env` file (optional)

---

## Step 2: Configure Netlify (3 minutes)

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to: **Site Settings** → **Environment Variables**
4. Click **Add a variable** and add these:

```
ADMIN_EMAIL = admin@unipod.unilag.edu.ng
ADMIN_PASSWORD_HASH = <paste from Step 1>
JWT_SECRET = <paste from Step 1>
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_ANON_KEY = <from Supabase dashboard>
SUPABASE_SERVICE_KEY = <from Supabase dashboard>
```

---

## Step 3: Enable Supabase Security (2 minutes)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to: **SQL Editor**
4. Copy and run this SQL:

```sql
-- Enable Row Level Security
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read" ON news FOR SELECT USING (published = true);
CREATE POLICY "Public read" ON events FOR SELECT USING (published = true);
CREATE POLICY "Public read" ON programs FOR SELECT USING (published = true);
CREATE POLICY "Public read" ON gallery FOR SELECT USING (published = true);
CREATE POLICY "Public read" ON partners FOR SELECT USING (published = true);

-- Admin write access
CREATE POLICY "Service write" ON news FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write" ON events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write" ON programs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write" ON gallery FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write" ON partners FOR ALL USING (auth.role() = 'service_role');
```

---

## Step 4: Deploy (1 minute)

```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

---

## Step 5: Test (2 minutes)

1. Visit: `https://your-site.netlify.app/admin.html`
2. Should redirect to `/login.html`
3. Login with your credentials
4. Should access admin panel ✅

**Security Test:**
- Open DevTools (F12) → Network tab
- Perform any admin action
- Verify: NO Supabase keys visible ✅

---

## 🎉 You're Done!

Your CMS is now:
- ✅ Secure (no credentials in browser)
- ✅ Protected (login required)
- ✅ Safe (industry-standard security)
- ✅ Production-ready

---

## Quick Links

📖 **Documentation:**
- [SECURITY_README.md](SECURITY_README.md) - Quick reference
- [DEPLOYMENT_SECURITY.md](DEPLOYMENT_SECURITY.md) - Detailed setup
- [SECURITY.md](SECURITY.md) - Complete security guide

🔧 **Tools:**
- [Login Page](frontend/login.html) - Admin login
- [Admin Panel](frontend/admin.html) - CMS (requires login)

📊 **Monitoring:**
- [Netlify Dashboard](https://app.netlify.com) - Deployment logs
- [Supabase Dashboard](https://supabase.com/dashboard) - Database logs

---

## Need Help?

**Common Issues:**
- Can't login? Check ADMIN_EMAIL and password hash
- "Unauthorized"? Verify JWT_SECRET is set
- No data? Check Supabase RLS policies

**Support:**
- 📧 Email: security@unipod.unilag.edu.ng
- 📖 Docs: See links above

---

## What's Protected

✅ Admin panel (login required)
✅ API keys (never exposed)
✅ Database (RLS enabled)
✅ Passwords (SHA-256 hashed)
✅ Sessions (JWT, 24h expiry)
✅ Against attacks (XSS, CSRF, SQL injection, brute force)

---

## Security Level: 🔒 PRODUCTION-READY

Your site is secure and ready to go live!

**Last Updated:** April 2026
