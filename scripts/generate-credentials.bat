@echo off
REM Generate Secure Credentials for AI UniPod CMS (Windows)
REM Run this script to generate all necessary security credentials

echo.
echo 🔒 AI UniPod Lagos - Security Credentials Generator
echo ==================================================
echo.

REM Check if Node.js is available
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: Node.js is not installed
    echo Please install Node.js first
    pause
    exit /b 1
)

echo 📝 Step 1: Admin Password
echo -------------------------
set /p ADMIN_PASSWORD="Enter your admin password: "
set /p ADMIN_PASSWORD_CONFIRM="Confirm password: "

if not "%ADMIN_PASSWORD%"=="%ADMIN_PASSWORD_CONFIRM%" (
    echo ❌ Passwords don't match!
    pause
    exit /b 1
)

echo.
echo Generating credentials...
echo.

REM Create a temporary Node.js script to generate credentials
echo const crypto = require('crypto'); > temp_gen.js
echo const password = '%ADMIN_PASSWORD%'; >> temp_gen.js
echo const hash = crypto.createHash('sha256').update(password).digest('hex'); >> temp_gen.js
echo const secret = crypto.randomBytes(32).toString('hex'); >> temp_gen.js
echo console.log('HASH:' + hash); >> temp_gen.js
echo console.log('SECRET:' + secret); >> temp_gen.js

REM Run the script and capture output
for /f "tokens=1,2 delims=:" %%a in ('node temp_gen.js') do (
    if "%%a"=="HASH" set ADMIN_PASSWORD_HASH=%%b
    if "%%a"=="SECRET" set JWT_SECRET=%%b
)

REM Clean up
del temp_gen.js

echo ✅ Credentials generated
echo.
echo 📋 Your Credentials
echo ===================
echo.
echo Copy these to your Netlify Environment Variables:
echo.
echo ADMIN_EMAIL=admin@unipod.unilag.edu.ng
echo ADMIN_PASSWORD_HASH=%ADMIN_PASSWORD_HASH%
echo JWT_SECRET=%JWT_SECRET%
echo.
echo ⚠️  IMPORTANT:
echo 1. Never commit these values to Git
echo 2. Store them securely (password manager recommended)
echo 3. Add them to Netlify: Site Settings → Environment Variables
echo.

REM Save to file (optional)
set /p SAVE_ENV="Save to .env file? (y/n): "

if /i "%SAVE_ENV%"=="y" (
    (
        echo # AI UniPod Lagos - Environment Variables
        echo # Generated: %date% %time%
        echo # NEVER commit this file to Git!
        echo.
        echo ADMIN_EMAIL=admin@unipod.unilag.edu.ng
        echo ADMIN_PASSWORD_HASH=%ADMIN_PASSWORD_HASH%
        echo JWT_SECRET=%JWT_SECRET%
        echo.
        echo # Add your Supabase credentials:
        echo SUPABASE_URL=https://your-project.supabase.co
        echo SUPABASE_ANON_KEY=your-anon-key-here
        echo SUPABASE_SERVICE_KEY=your-service-key-here
    ) > .env
    echo ✅ Saved to .env file
    echo ⚠️  Remember to add Supabase credentials to .env
) else (
    echo ℹ️  Credentials not saved to file
)

echo.
echo 🎉 Done! Next steps:
echo 1. Add these to Netlify Environment Variables
echo 2. Configure Supabase credentials
echo 3. Enable Row Level Security in Supabase
echo 4. Deploy your site
echo.
echo 📖 See DEPLOYMENT_SECURITY.md for detailed instructions
echo.
pause
