# Deployment & Security Setup Guide

## Quick Start - Secure Your CMS in 5 Steps

### Step 1: Generate Secure Credentials

```bash
# 1. Generate password hash (replace 'YourSecurePassword123!' with your actual password)
echo -n "YourSecurePassword123!" | sha256sum
# Copy the output hash

# 2. Generate JWT secret
openssl rand -hex 32
# Copy the output secret
```

### Step 2: Configure Netlify Environment Variables

1. Go to your Netlify dashboard
2. Navigate to: Site Settings → Environment Variables
3. Add these variables:

```
ADMIN_EMAIL = admin@unipod.unilag.edu.ng
ADMIN_PASSWORD_HASH = <paste-your-generated-hash>
JWT_SECRET = <paste-your-generated-secret>
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_ANON_KEY = <your-supabase-anon-key>
SUPABASE_SERVICE_KEY = <your-supabase-service-key>
```

### Step 3: Enable Supabase Row Level Security

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Public can read published content
CREATE POLICY "Public read" ON news FOR SELECT USING (published = true);
CREATE POLICY "Public read" ON events FOR SELECT USING (published = true);
CREATE POLICY "Public read" ON programs FOR SELECT USING (published = true);
CREATE POLICY "Public read" ON gallery FOR SELECT USING (published = true);
CREATE POLICY "Public read" ON partners FOR SELECT USING (published = true);

-- Only service role can write
CREATE POLICY "Service write" ON news FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write" ON events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write" ON programs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write" ON gallery FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write" ON partners FOR ALL USING (auth.role() = 'service_role');
```

### Step 4: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Step 5: Access Your Secure Admin Panel

1. Visit: `https://your-site.netlify.app/login.html`
2. Login with your admin email and password
3. You'll be redirected to the secure admin panel

## Security Features Implemented

### ✅ Authentication
- Server-side authentication via Netlify Functions
- Password hashing (SHA-256)
- JWT token-based sessions
- 24-hour session expiry
- Automatic logout on inactivity

### ✅ API Protection
- All Supabase requests proxied through secure functions
- API keys never exposed to client
- Environment variables for all secrets
- Row Level Security (RLS) enabled

### ✅ Attack Prevention
- XSS Protection headers
- CSRF protection
- SQL injection prevention (via Supabase)
- Rate limiting on auth endpoints
- Brute force protection (1-second delay on failed login)

### ✅ Data Security
- HTTPS enforced
- Secure headers (CSP, X-Frame-Options, etc.)
- Input validation and sanitization
- No sensitive data in frontend code

## Testing Your Security

### Test 1: Verify API Keys Are Hidden
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to access admin panel
4. Check all requests - you should NOT see any Supabase keys

### Test 2: Verify Authentication Works
1. Try accessing `/admin.html` directly
2. You should be redirected to `/login.html`
3. Login with correct credentials
4. You should access the admin panel

### Test 3: Verify RLS Works
1. Open browser console
2. Try to make a direct Supabase request
3. It should fail or only return published content

## Troubleshooting

### "Invalid credentials" error
- Check that ADMIN_EMAIL matches exactly
- Verify password hash was generated correctly
- Ensure environment variables are set in Netlify

### "Unauthorized" error in admin panel
- Check JWT_SECRET is set
- Clear browser cache and cookies
- Try logging in again

### Can't access Supabase data
- Verify SUPABASE_URL and keys are correct
- Check RLS policies are enabled
- Ensure service key has proper permissions

## Maintenance

### Changing Admin Password
1. Generate new hash: `echo -n "NewPassword" | sha256sum`
2. Update ADMIN_PASSWORD_HASH in Netlify
3. Redeploy site

### Rotating JWT Secret
1. Generate new secret: `openssl rand -hex 32`
2. Update JWT_SECRET in Netlify
3. All users will be logged out automatically

### Adding More Admins
Currently supports single admin. To add multiple:
1. Modify `admin-auth.js` to check against multiple credentials
2. Or integrate with Supabase Auth for user management

## Production Checklist

- [ ] Environment variables configured
- [ ] Strong password set (12+ characters)
- [ ] JWT secret generated
- [ ] Supabase RLS enabled
- [ ] HTTPS enforced
- [ ] Security headers active
- [ ] `.env` in `.gitignore`
- [ ] Test login works
- [ ] Test admin panel access
- [ ] Test data operations
- [ ] Backup credentials securely

## Support

For issues or questions:
- Check SECURITY.md for detailed security info
- Review Netlify function logs
- Check Supabase logs
- Contact: tech@unipod.unilag.edu.ng

---

🔒 Your CMS is now secure! No credentials are exposed in the browser.
