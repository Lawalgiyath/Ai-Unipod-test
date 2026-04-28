@echo off
REM AI UniPod News Scraper Setup Script (Windows)

echo ========================================
echo AI UniPod News Scraper Setup
echo ========================================
echo.

REM Check if .env exists
if exist .env (
    echo WARNING: .env file already exists
    set /p OVERWRITE="Do you want to overwrite it? (y/N): "
    if /i not "%OVERWRITE%"=="y" (
        echo Setup cancelled.
        exit /b 0
    )
)

REM Create .env file
echo Creating .env file...
copy .env.example .env >nul

REM Prompt for NewsAPI key
echo.
echo Please enter your NewsAPI key:
echo (Get one free at: https://newsapi.org/register)
set /p NEWS_API_KEY="NewsAPI Key: "

REM Update .env file
if not "%NEWS_API_KEY%"=="" (
    powershell -Command "(gc .env) -replace 'your_newsapi_key_here', '%NEWS_API_KEY%' | Out-File -encoding ASCII .env"
    echo [OK] NewsAPI key configured
) else (
    echo [WARNING] No API key provided. You can add it later to .env
)

REM Install dependencies
echo.
echo Installing dependencies...
call npm install

echo.
echo ========================================
echo Setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Test locally: npm run scrape:news
echo 2. Add NEWS_API_KEY to GitHub Secrets for automation
echo 3. Enable GitHub Actions in your repository
echo.
echo For GitHub Secrets:
echo   Settings -^> Secrets and variables -^> Actions -^> New repository secret
echo   Name: NEWS_API_KEY
echo   Value: %NEWS_API_KEY%
echo.
pause
