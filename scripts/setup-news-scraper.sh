#!/bin/bash

# AI UniPod News Scraper Setup Script
# This script helps you configure the news scraper securely

echo "🚀 AI UniPod News Scraper Setup"
echo "================================"
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Create .env file
echo "📝 Creating .env file..."
cp .env.example .env

# Prompt for NewsAPI key
echo ""
echo "Please enter your NewsAPI key:"
echo "(Get one free at: https://newsapi.org/register)"
read -p "NewsAPI Key: " NEWS_API_KEY

# Update .env file
if [ ! -z "$NEWS_API_KEY" ]; then
    sed -i.bak "s/your_newsapi_key_here/$NEWS_API_KEY/" .env
    rm .env.bak 2>/dev/null
    echo "✅ NewsAPI key configured"
else
    echo "⚠️  No API key provided. You can add it later to .env"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Test locally: npm run scrape:news"
echo "2. Add NEWS_API_KEY to GitHub Secrets for automation"
echo "3. Enable GitHub Actions in your repository"
echo ""
echo "For GitHub Secrets:"
echo "  Settings → Secrets and variables → Actions → New repository secret"
echo "  Name: NEWS_API_KEY"
echo "  Value: $NEWS_API_KEY"
echo ""
