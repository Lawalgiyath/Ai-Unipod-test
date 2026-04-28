@echo off
echo ========================================
echo AI UniPod News Scraper
echo ========================================
echo.

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Set API key
set NEWS_API_KEY=6754ddf1929a4cf1b9de92d391eb753a

echo Running news scraper...
echo.
node scripts/scrape-news-advanced.js

echo.
echo ========================================
echo Done! Check frontend/js/mock-data.js
echo ========================================
pause
