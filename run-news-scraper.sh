#!/bin/bash

echo "========================================"
echo "AI UniPod News Scraper"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Set API key
export NEWS_API_KEY="6754ddf1929a4cf1b9de92d391eb753a"

echo "Running news scraper..."
echo ""
node scripts/scrape-news-advanced.js

echo ""
echo "========================================"
echo "Done! Check frontend/js/mock-data.js"
echo "========================================"
