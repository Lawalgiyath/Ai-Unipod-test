@echo off
REM Script to switch from Mock Data to Supabase Backend
REM Run this after configuring Supabase credentials

echo.
echo Switching to Supabase Backend...
echo.

REM Update index.html
echo Updating index.html...
powershell -Command "(gc index.html) -replace '<script src=\"js/mock-data.js\"></script>', '<!-- <script src=\"js/mock-data.js\"></script> -->' | Out-File -encoding ASCII index.html"
powershell -Command "(gc index.html) -replace '<!-- Supabase \\(uncomment when configured\\)', '<!-- Supabase Backend -->' | Out-File -encoding ASCII index.html"

REM Update other HTML files
for %%f in (news.html events.html programs.html gallery.html partners.html about.html admin.html) do (
  if exist %%f (
    echo Updating %%f...
    powershell -Command "(gc %%f) -replace '<script src=\"js/mock-data.js\"></script>', '<!-- <script src=\"js/mock-data.js\"></script> -->' | Out-File -encoding ASCII %%f"
  )
)

echo.
echo Done! All HTML files updated to use Supabase.
echo.
echo IMPORTANT: Make sure you've configured your Supabase credentials in js/supabase-client.js
echo.
echo Next steps:
echo 1. Open js/supabase-client.js
echo 2. Replace SUPABASE_URL and SUPABASE_ANON_KEY with your credentials
echo 3. Refresh your browser
echo.
pause
