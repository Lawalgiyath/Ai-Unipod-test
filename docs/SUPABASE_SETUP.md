# Supabase Backend Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: AI UniPod Lagos
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to Nigeria (e.g., Frankfurt or Singapore)
5. Wait for project to be created (~2 minutes)

## Step 2: Get Your Credentials

1. Go to **Project Settings** > **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (long string)

## Step 3: Create Database Tables

Go to **SQL Editor** and run this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- News Table
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  body TEXT,
  cover_image TEXT,
  category TEXT,
  published_date TIMESTAMPTZ DEFAULT NOW(),
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  cover_image TEXT,
  category TEXT,
  registration_link TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Programs Table
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  cover_image TEXT,
  category TEXT,
  status TEXT DEFAULT 'Active',
  application_link TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery Table
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partners Table
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  category TEXT,
  "order" INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_news_published ON news(published, published_date DESC);
CREATE INDEX idx_events_published ON events(published, event_date DESC);
CREATE INDEX idx_programs_published ON programs(published, created_at DESC);
CREATE INDEX idx_gallery_published ON gallery(published, created_at DESC);
CREATE INDEX idx_partners_order ON partners("order", name);

-- Enable Row Level Security (RLS)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read published news" ON news FOR SELECT USING (published = true);
CREATE POLICY "Public can read published events" ON events FOR SELECT USING (published = true);
CREATE POLICY "Public can read published programs" ON programs FOR SELECT USING (published = true);
CREATE POLICY "Public can read published gallery" ON gallery FOR SELECT USING (published = true);
CREATE POLICY "Public can read published partners" ON partners FOR SELECT USING (published = true);

-- Admin policies (authenticated users can do everything)
CREATE POLICY "Authenticated users can insert news" ON news FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update news" ON news FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete news" ON news FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can read all news" ON news FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert events" ON events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update events" ON events FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete events" ON events FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can read all events" ON events FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert programs" ON programs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update programs" ON programs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete programs" ON programs FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can read all programs" ON programs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert gallery" ON gallery FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update gallery" ON gallery FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete gallery" ON gallery FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can read all gallery" ON gallery FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert partners" ON partners FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update partners" ON partners FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete partners" ON partners FOR DELETE TO authenticated USING (true);
CREATE POLICY "Authenticated users can read all partners" ON partners FOR SELECT TO authenticated USING (true);
```

## Step 4: Insert Sample Data

Run this SQL to add initial data:

```sql
-- Insert sample news
INSERT INTO news (title, slug, excerpt, body, cover_image, category, published_date, featured) VALUES
('AI UniPod Lagos Officially Opens', 'ai-unipod-lagos-opens', 
 'Nigeria''s first AI-themed University Innovation Pod opens its doors at the University of Lagos.',
 '<p>The AI UniPod Lagos has officially opened at the University of Lagos, Akoka Campus. This groundbreaking facility represents a partnership between UNILAG and UNDP''s Timbuktoo Initiative.</p>',
 'https://unilag.edu.ng/wp-content/uploads/2026/03/photo_2_2026-03-11_09-17-05-1024x918.jpg',
 'Announcement', '2026-03-11', true),
 
('UNDP and UNILAG Sign Historic MoU', 'undp-unilag-mou',
 'UNDP and University of Lagos formalize partnership to establish Nigeria''s first AI-themed University Innovation Pod.',
 '<p>In a landmark ceremony, UNDP and UNILAG signed a Memorandum of Understanding to establish the AI UniPod Lagos.</p>',
 'https://unilag.edu.ng/wp-content/uploads/2025/03/MG_0947-edited-scaled.jpg',
 'Partnership', '2025-03-15', false);

-- Insert sample events
INSERT INTO events (title, description, event_date, end_date, location, category, registration_link, featured) VALUES
('AI Innovation Bootcamp 2026', 
 '<p>Intensive 6-week bootcamp covering AI fundamentals, machine learning, and practical applications.</p>',
 '2026-06-01', '2026-07-15', 'AI UniPod, UNILAG Akoka Campus', 'Bootcamp', 
 'https://forms.gle/example', true),
 
('Open House Day', 
 '<p>Tour the AI UniPod facilities, meet the team, and learn about our programs.</p>',
 '2026-05-15', '2026-05-15', 'AI UniPod, UNILAG', 'Open Day',
 'https://forms.gle/example', false);

-- Insert sample programs
INSERT INTO programs (title, subtitle, description, cover_image, category, status, application_link) VALUES
('AI Solutions for Africa', 'Build AI solutions for African challenges',
 '<p>Our flagship program trains students to develop AI solutions addressing real African challenges.</p>',
 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
 'AI Training', 'Active', 'https://forms.gle/example'),
 
('AI Innovation Bootcamp', 'Intensive 6-week AI training',
 '<p>Accelerated bootcamp covering machine learning, deep learning, computer vision, and NLP.</p>',
 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
 'Bootcamp', 'Active', 'https://forms.gle/example');

-- Insert sample gallery
INSERT INTO gallery (title, image_url, category) VALUES
('AI Lab Workstations', 'https://unilag.edu.ng/wp-content/uploads/2026/03/photo_2_2026-03-11_09-17-05-1024x918.jpg', 'Facility'),
('Open House Day 2026', 'https://unilag.edu.ng/wp-content/uploads/2026/03/photo_5_2026-03-11_09-17-05-1024x682.jpg', 'Events'),
('Groundbreaking Ceremony', 'https://unilag.edu.ng/wp-content/uploads/2025/03/MG_0870-1024x575.jpg', 'Events');

-- Insert sample partners
INSERT INTO partners (name, logo_url, website, description, category, "order") VALUES
('UNDP', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/UNDP_logo.svg/240px-UNDP_logo.svg.png', 
 'https://www.undp.org', 'United Nations Development Programme', 'UN Agency', 1),
('University of Lagos', '', 'https://unilag.edu.ng', 'Host Institution', 'University', 2);
```

## Step 5: Set Up Storage (Optional - for image uploads)

1. Go to **Storage** in Supabase dashboard
2. Click **New Bucket**
3. Name it: `unipod-media`
4. Make it **Public**
5. Set up policies:

```sql
-- Allow public read access
CREATE POLICY "Public can read media" ON storage.objects FOR SELECT USING (bucket_id = 'unipod-media');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload media" ON storage.objects 
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'unipod-media');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete media" ON storage.objects 
  FOR DELETE TO authenticated USING (bucket_id = 'unipod-media');
```

## Step 6: Create Admin User

1. Go to **Authentication** > **Users**
2. Click **Add User**
3. Enter:
   - **Email**: admin@unipod.com (or your email)
   - **Password**: (create a strong password)
4. Click **Create User**

## Step 7: Update Your Website

Open `js/supabase-client.js` and replace:

```javascript
const SUPABASE_URL = 'YOUR_PROJECT_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

## Step 8: Enable Supabase in HTML

In all HTML files, replace:

```html
<!-- Mock Data (remove this and uncomment Supabase when ready) -->
<script src="js/mock-data.js"></script>

<!-- Supabase (uncomment when configured)
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/supabase-client.js"></script>
-->
```

With:

```html
<!-- Supabase Backend -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/supabase-client.js"></script>
```

## Done! 🎉

Your site now has a real backend with:
- ✅ Full CRUD operations
- ✅ Real-time updates
- ✅ Authentication
- ✅ File uploads
- ✅ Row-level security
- ✅ Scalable infrastructure

## Admin Panel Access

Visit `admin.html` and log in with your admin credentials to manage content.
