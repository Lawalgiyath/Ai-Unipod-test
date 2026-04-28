# AI UniPod Lagos - Project Structure

## 📁 Directory Organization

```
AI-UNIPOD-SITE/
├── frontend/              # All frontend files
│   ├── css/              # Stylesheets
│   │   ├── style.css     # Main styles
│   │   └── home.css      # Home page specific styles
│   ├── js/               # JavaScript files
│   │   ├── main.js       # Core functionality
│   │   ├── home.js       # Home page interactions
│   │   ├── config.js     # Configuration
│   │   ├── mock-data.js  # Mock API data
│   │   ├── supabase-client.js  # Supabase integration
│   │   └── immersive.js  # Immersive effects
│   ├── images/           # Image assets
│   │   └── unipod-logo.svg
│   ├── index.html        # Homepage
│   ├── about.html        # About page
│   ├── programs.html     # Programs page
│   ├── news.html         # News page
│   ├── events.html       # Events page
│   ├── gallery.html      # Gallery page
│   ├── partners.html     # Partners page
│   └── admin.html        # Admin panel
│
├── docs/                 # Documentation
│   ├── QUICK_START.md    # Quick start guide
│   ├── SUPABASE_SETUP.md # Supabase setup instructions
│   ├── DEPLOYMENT_GUIDE.md
│   ├── ALL_LOGOS_COMPLETE.md
│   └── ...other docs
│
├── scripts/              # Utility scripts
│   ├── switch-to-supabase.sh   # Unix script
│   └── switch-to-supabase.bat  # Windows script
│
├── .vscode/              # VS Code settings
├── package.json          # Node dependencies
├── README.md             # Main readme
├── robots.txt            # SEO
└── sitemap.xml           # SEO

```

## 🚀 Quick Start

1. **Development**: Open `frontend/index.html` in a browser
2. **Production**: Deploy the `frontend/` folder to your hosting
3. **Supabase Setup**: See `docs/SUPABASE_SETUP.md`

## 📝 Key Files

- **frontend/index.html** - Main entry point
- **frontend/css/style.css** - Global styles with UniPods branding
- **frontend/js/config.js** - Switch between Mock/Supabase
- **docs/QUICK_START.md** - Getting started guide

## 🎨 Design System

- **Primary Color**: #1E84C2 (UniPods Blue)
- **Secondary Color**: #FFDE59 (UniPods Yellow)
- **Typography**: Ubuntu (headlines), Proxima Nova (body)

## 🔧 Configuration

Edit `frontend/js/config.js` to switch between:
- Mock API (default, no setup needed)
- Supabase (requires setup, see docs)
