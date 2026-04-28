#!/bin/bash

# Generate Secure Credentials for AI UniPod CMS
# Run this script to generate all necessary security credentials

echo "🔒 AI UniPod Lagos - Security Credentials Generator"
echo "=================================================="
echo ""

# Check if required tools are available
if ! command -v openssl &> /dev/null; then
    echo "❌ Error: openssl is not installed"
    echo "Please install openssl first"
    exit 1
fi

echo "📝 Step 1: Admin Password"
echo "-------------------------"
read -sp "Enter your admin password: " ADMIN_PASSWORD
echo ""
read -sp "Confirm password: " ADMIN_PASSWORD_CONFIRM
echo ""

if [ "$ADMIN_PASSWORD" != "$ADMIN_PASSWORD_CONFIRM" ]; then
    echo "❌ Passwords don't match!"
    exit 1
fi

# Generate password hash
ADMIN_PASSWORD_HASH=$(echo -n "$ADMIN_PASSWORD" | sha256sum | cut -d' ' -f1)

echo ""
echo "✅ Password hash generated"
echo ""

# Generate JWT secret
echo "🔑 Step 2: JWT Secret"
echo "-------------------------"
JWT_SECRET=$(openssl rand -hex 32)
echo "✅ JWT secret generated"
echo ""

# Display results
echo "📋 Your Credentials"
echo "==================="
echo ""
echo "Copy these to your Netlify Environment Variables:"
echo ""
echo "ADMIN_EMAIL=admin@unipod.unilag.edu.ng"
echo "ADMIN_PASSWORD_HASH=$ADMIN_PASSWORD_HASH"
echo "JWT_SECRET=$JWT_SECRET"
echo ""
echo "⚠️  IMPORTANT:"
echo "1. Never commit these values to Git"
echo "2. Store them securely (password manager recommended)"
echo "3. Add them to Netlify: Site Settings → Environment Variables"
echo ""

# Save to file (optional)
read -p "Save to .env file? (y/n): " SAVE_ENV

if [ "$SAVE_ENV" = "y" ] || [ "$SAVE_ENV" = "Y" ]; then
    cat > .env << EOF
# AI UniPod Lagos - Environment Variables
# Generated: $(date)
# NEVER commit this file to Git!

ADMIN_EMAIL=admin@unipod.unilag.edu.ng
ADMIN_PASSWORD_HASH=$ADMIN_PASSWORD_HASH
JWT_SECRET=$JWT_SECRET

# Add your Supabase credentials:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here
EOF
    echo "✅ Saved to .env file"
    echo "⚠️  Remember to add Supabase credentials to .env"
else
    echo "ℹ️  Credentials not saved to file"
fi

echo ""
echo "🎉 Done! Next steps:"
echo "1. Add these to Netlify Environment Variables"
echo "2. Configure Supabase credentials"
echo "3. Enable Row Level Security in Supabase"
echo "4. Deploy your site"
echo ""
echo "📖 See DEPLOYMENT_SECURITY.md for detailed instructions"
