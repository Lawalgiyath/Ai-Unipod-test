#!/bin/bash

# Script to switch from Mock Data to Supabase Backend
# Run this after configuring Supabase credentials

echo "🔄 Switching to Supabase Backend..."
echo ""

# List of HTML files to update
files=("index.html" "news.html" "events.html" "programs.html" "gallery.html" "partners.html" "about.html" "admin.html")

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Updating $file..."
    
    # Comment out mock-data.js
    sed -i.bak 's|<script src="js/mock-data.js"></script>|<!-- <script src="js/mock-data.js"></script> -->|g' "$file"
    
    # Uncomment Supabase scripts
    sed -i.bak 's|<!-- Supabase (uncomment when configured)|<!-- Supabase Backend -->|g' "$file"
    sed -i.bak 's|<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>|<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>|g' "$file"
    sed -i.bak 's|<script src="js/supabase-client.js"></script>|<script src="js/supabase-client.js"></script>|g' "$file"
    sed -i.bak 's|-->||g' "$file"
    
    # Remove backup file
    rm -f "$file.bak"
  fi
done

echo ""
echo "✅ Done! All HTML files updated to use Supabase."
echo ""
echo "⚠️  IMPORTANT: Make sure you've configured your Supabase credentials in js/supabase-client.js"
echo ""
echo "Next steps:"
echo "1. Open js/supabase-client.js"
echo "2. Replace SUPABASE_URL and SUPABASE_ANON_KEY with your credentials"
echo "3. Refresh your browser"
echo ""
