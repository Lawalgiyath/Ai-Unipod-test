# AI UniPod Lagos — Deployment Guide

## 🚀 Production Deployment Checklist

### 1. Supabase Backend Setup

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key
3. Create the following tables:

```sql
-- News Articles
CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  body TEXT,
  cover_image TEXT,
  category TEXT,
  published_date TIMESTAMPTZ DEFAULT NOW(),
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  cover_image TEXT,
  category TEXT,
  registration_link TEXT,
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Programs
CREATE TABLE programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  cover_image TEXT,
  category TEXT,
  status TEXT DEFAULT 'Active',
  application_link TEXT,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partners
CREATE TABLE partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  category TEXT,
  "order" INTEGER DEFAULT 99,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON news FOR SELECT USING (published = true);
CREATE POLICY "Public read access" ON events FOR SELECT USING (published = true);
CREATE POLICY "Public read access" ON programs FOR SELECT USING (published = true);
CREATE POLICY "Public read access" ON gallery FOR SELECT USING (published = true);
CREATE POLICY "Public read access" ON partners FOR SELECT USING (published = true);

-- Admin full access (requires authentication)
CREATE POLICY "Admin full access" ON news FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON programs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access" ON partners FOR ALL USING (auth.role() = 'authenticated');
```

#### Enable Supabase Storage (for images)
1. Create a bucket called `unipod-media`
2. Set it to public
3. Configure CORS if needed

### 2. Environment Configuration

Create `js/config.js`:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

### 3. Performance Optimization

- [ ] Minify CSS and JavaScript
- [ ] Optimize images (use WebP format)
- [ ] Enable CDN for Three.js
- [ ] Add service worker for offline support
- [ ] Implement lazy loading for images
- [ ] Add preconnect hints for external resources

### 4. SEO & Meta Tags

- [ ] Add Open Graph meta tags
- [ ] Create sitemap.xml
- [ ] Add robots.txt
- [ ] Implement structured data (JSON-LD)
- [ ] Add canonical URLs
- [ ] Configure Google Analytics / Plausible

### 5. Security

- [ ] Add Content Security Policy headers
- [ ] Enable HTTPS only
- [ ] Implement rate limiting on API
- [ ] Add CSRF protection
- [ ] Sanitize user inputs
- [ ] Configure Supabase RLS policies

### 6. Hosting Options

#### Option A: Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

#### Option B: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Option C: GitHub Pages
- Push to `gh-pages` branch
- Enable GitHub Pages in repository settings

### 7. Domain & DNS

- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Configure DNS records
- [ ] Add www redirect

### 8. Monitoring

- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Configure error tracking (Sentry)
- [ ] Add performance monitoring
- [ ] Set up analytics

### 9. Content Population

Use the admin panel to add:
- [ ] 5-10 news articles
- [ ] Upcoming events
- [ ] Program details
- [ ] Gallery photos (20+)
- [ ] Partner logos

### 10. Testing

- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit (WAVE, axe)
- [ ] Load testing

## 📊 Performance Targets

- Lighthouse Score: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

## 🔒 Security Headers

Add to your hosting platform:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data: https:;
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## 📱 Progressive Web App (Optional)

Add `manifest.json` and service worker for PWA support.

## 🌍 Internationalization (Future)

Consider adding multi-language support for:
- English (default)
- Yoruba
- Igbo
- Hausa

## 📞 Support Contacts

- Technical: tech@unipodlagos.ng
- Content: content@unipodlagos.ng
- Admin: admin@unipodlagos.ng
