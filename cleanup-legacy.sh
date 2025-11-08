#!/bin/bash
# Bash Script to Clean Up Legacy Files
# Run this from the root of geolocation-tracker repository

echo "🧹 Geolocation Tracker - Legacy Files Cleanup"
echo "============================================="
echo ""

# Safety check
if [ ! -d "nextjs-geolocation-tracker" ]; then
    echo "❌ Error: nextjs-geolocation-tracker folder not found!"
    echo "   Please run this script from the root of the repository."
    exit 1
fi

echo "⚠️  WARNING: This will delete legacy Express.js files!"
echo "   A backup branch will be created first."
echo ""

read -p "Do you want to continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "❌ Cleanup cancelled."
    exit 0
fi

echo ""
echo "📦 Step 1: Creating backup branch..."

# Create backup branch
git checkout -b backup-before-cleanup 2>/dev/null
if [ $? -eq 0 ]; then
    git add .
    git commit -m "Backup before cleanup" 2>/dev/null
    echo "✅ Backup branch created: backup-before-cleanup"
else
    echo "⚠️  Backup branch may already exist or git error occurred"
fi

git checkout main 2>/dev/null
echo ""

# Ask what to clean
echo "What would you like to clean?"
echo "1. Everything (Recommended - deletes all legacy files)"
echo "2. Server files only (server.js, database.js, api/)"
echo "3. Public files only (HTML, JS, CSS)"
echo "4. Documentation only (old guides)"
echo "5. Archive instead of delete (safest)"
echo "6. Cancel"
echo ""

read -p "Enter your choice (1-6): " choice

remove_legacy_server_files() {
    echo "🗑️  Removing legacy server files..."
    
    files=(
        "server.js"
        "server.tmp"
        "database.js"
        "Procfile"
    )
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            rm -f "$file"
            echo "   ✓ Deleted: $file"
        fi
    done
    
    if [ -d "api" ]; then
        rm -rf "api"
        echo "   ✓ Deleted: api/"
    fi
}

remove_legacy_public_files() {
    echo "🗑️  Removing legacy public files..."
    
    files=(
        "public/admin.html"
        "public/admin.js"
        "public/admin-styles.css"
        "public/index.html"
        "public/track.html"
        "public/track.js"
        "public/track-styles.css"
        "public/dynamic-track.html"
        "public/dynamic-track-styles.css"
        "public/editor.html"
        "public/editor.js"
        "public/theme-toggle.js"
        "public/theme-button-styles.css"
        "public/design-system.css"
    )
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            rm -f "$file"
            echo "   ✓ Deleted: $file"
        fi
    done
    
    if [ -d "public/legacy" ]; then
        rm -rf "public/legacy"
        echo "   ✓ Deleted: public/legacy/"
    fi
}

remove_legacy_package_files() {
    echo "🗑️  Removing legacy package files..."
    
    if [ -f "package.json" ]; then
        rm -f "package.json"
        echo "   ✓ Deleted: package.json"
    fi
    
    if [ -f "package-lock.json" ]; then
        rm -f "package-lock.json"
        echo "   ✓ Deleted: package-lock.json"
    fi
    
    if [ -d "node_modules" ]; then
        echo "   ⏳ Deleting node_modules/ (this may take a moment)..."
        rm -rf "node_modules"
        echo "   ✓ Deleted: node_modules/"
    fi
}

remove_legacy_deployment_files() {
    echo "🗑️  Removing legacy deployment files..."
    
    files=(
        "deploy-vercel.ps1"
        "deploy-vercel.sh"
        "vercel.json"
        ".vercelignore"
    )
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            rm -f "$file"
            echo "   ✓ Deleted: $file"
        fi
    done
}

remove_legacy_docs() {
    echo "🗑️  Removing legacy documentation..."
    
    files=(
        "START_HERE_DEPLOYMENT.md"
        "DEPLOYMENT_COMPLETE.md"
        "QUICK_DEPLOY_REFERENCE.md"
        "VERCEL_DEPLOYMENT.md"
        "VERCEL_FIXES_SUMMARY.md"
        "DEPLOYMENT_GUIDE.md"
        "README-PRODUCTION.md"
        "START_HERE.md"
        "QUICK_START.md"
        "ENCRYPTION_KEY_GUIDE.md"
        "PERSISTENT_LOCATION_GUIDE.md"
        "GPS_REQUIRED_GUIDE.md"
        "COOKIE_CONSENT_GUIDE.md"
        "FINAL_SUMMARY.md"
        "CUSTOMIZATION_GUIDE.md"
        "STEALTH_GUIDE.md"
    )
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            rm -f "$file"
            echo "   ✓ Deleted: $file"
        fi
    done
}

archive_legacy_files() {
    echo "📦 Creating archive folder..."
    
    mkdir -p "archive-legacy"
    
    # Archive files
    files=(
        "server.js" "server.tmp" "database.js" "Procfile"
        "package.json" "package-lock.json"
        "deploy-vercel.ps1" "deploy-vercel.sh" "vercel.json" ".vercelignore"
        "START_HERE_DEPLOYMENT.md" "DEPLOYMENT_COMPLETE.md"
        "QUICK_DEPLOY_REFERENCE.md" "VERCEL_DEPLOYMENT.md"
        "VERCEL_FIXES_SUMMARY.md" "DEPLOYMENT_GUIDE.md"
        "README-PRODUCTION.md" "START_HERE.md" "QUICK_START.md"
        "ENCRYPTION_KEY_GUIDE.md" "PERSISTENT_LOCATION_GUIDE.md"
        "GPS_REQUIRED_GUIDE.md" "COOKIE_CONSENT_GUIDE.md"
        "FINAL_SUMMARY.md" "CUSTOMIZATION_GUIDE.md" "STEALTH_GUIDE.md"
    )
    
    for file in "${files[@]}"; do
        if [ -f "$file" ]; then
            mv "$file" "archive-legacy/"
            echo "   ✓ Archived: $file"
        fi
    done
    
    if [ -d "api" ]; then
        mv "api" "archive-legacy/"
        echo "   ✓ Archived: api/"
    fi
    
    if [ -d "public" ]; then
        mkdir -p "archive-legacy/public"
        find public -maxdepth 1 -type f -exec mv {} archive-legacy/public/ \;
        if [ -d "public/legacy" ]; then
            mv "public/legacy" "archive-legacy/public/"
        fi
        echo "   ✓ Archived: public/ files"
    fi
    
    echo ""
    echo "✅ Files archived to: archive-legacy/"
    echo "   You can delete this folder later if everything works fine."
}

echo ""

case $choice in
    1)
        echo "🗑️  Cleaning everything..."
        remove_legacy_server_files
        remove_legacy_public_files
        remove_legacy_package_files
        remove_legacy_deployment_files
        remove_legacy_docs
        ;;
    2)
        remove_legacy_server_files
        remove_legacy_package_files
        remove_legacy_deployment_files
        ;;
    3)
        remove_legacy_public_files
        ;;
    4)
        remove_legacy_docs
        ;;
    5)
        archive_legacy_files
        ;;
    6)
        echo "❌ Cleanup cancelled."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Cleanup cancelled."
        exit 1
        ;;
esac

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Test your Next.js app: cd nextjs-geolocation-tracker && npm run dev"
echo "   2. Review changes: git status"
echo "   3. Commit changes: git add . && git commit -m 'Clean up legacy files'"
echo "   4. Push to remote: git push origin main"
echo ""
echo "💡 Tip: Your backup is in branch 'backup-before-cleanup'"
echo "   To restore: git checkout backup-before-cleanup"
echo ""

