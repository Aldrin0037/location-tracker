# PowerShell Script to Clean Up Legacy Files
# Run this from the root of geolocation-tracker repository

Write-Host "🧹 Geolocation Tracker - Legacy Files Cleanup" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Safety check
$currentDir = Get-Location
if (-not (Test-Path "nextjs-geolocation-tracker")) {
    Write-Host "❌ Error: nextjs-geolocation-tracker folder not found!" -ForegroundColor Red
    Write-Host "   Please run this script from the root of the repository." -ForegroundColor Yellow
    exit 1
}

Write-Host "⚠️  WARNING: This will delete legacy Express.js files!" -ForegroundColor Yellow
Write-Host "   A backup branch will be created first." -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Do you want to continue? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "❌ Cleanup cancelled." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "📦 Step 1: Creating backup branch..." -ForegroundColor Green

# Create backup branch
git checkout -b backup-before-cleanup 2>$null
if ($LASTEXITCODE -eq 0) {
    git add .
    git commit -m "Backup before cleanup" 2>$null
    Write-Host "✅ Backup branch created: backup-before-cleanup" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backup branch may already exist or git error occurred" -ForegroundColor Yellow
}

git checkout main 2>$null
Write-Host ""

# Ask what to clean
Write-Host "What would you like to clean?" -ForegroundColor Cyan
Write-Host "1. Everything (Recommended - deletes all legacy files)"
Write-Host "2. Server files only (server.js, database.js, api/)"
Write-Host "3. Public files only (HTML, JS, CSS)"
Write-Host "4. Documentation only (old guides)"
Write-Host "5. Archive instead of delete (safest)"
Write-Host "6. Cancel"
Write-Host ""

$choice = Read-Host "Enter your choice (1-6)"

function Remove-LegacyServerFiles {
    Write-Host "🗑️  Removing legacy server files..." -ForegroundColor Yellow
    
    $files = @(
        "server.js",
        "server.tmp",
        "database.js",
        "Procfile"
    )
    
    foreach ($file in $files) {
        if (Test-Path $file) {
            Remove-Item $file -Force
            Write-Host "   ✓ Deleted: $file" -ForegroundColor Gray
        }
    }
    
    if (Test-Path "api") {
        Remove-Item "api" -Recurse -Force
        Write-Host "   ✓ Deleted: api/" -ForegroundColor Gray
    }
}

function Remove-LegacyPublicFiles {
    Write-Host "🗑️  Removing legacy public files..." -ForegroundColor Yellow
    
    $files = @(
        "public/admin.html",
        "public/admin.js",
        "public/admin-styles.css",
        "public/index.html",
        "public/track.html",
        "public/track.js",
        "public/track-styles.css",
        "public/dynamic-track.html",
        "public/dynamic-track-styles.css",
        "public/editor.html",
        "public/editor.js",
        "public/theme-toggle.js",
        "public/theme-button-styles.css",
        "public/design-system.css"
    )
    
    foreach ($file in $files) {
        if (Test-Path $file) {
            Remove-Item $file -Force
            Write-Host "   ✓ Deleted: $file" -ForegroundColor Gray
        }
    }
    
    if (Test-Path "public/legacy") {
        Remove-Item "public/legacy" -Recurse -Force
        Write-Host "   ✓ Deleted: public/legacy/" -ForegroundColor Gray
    }
}

function Remove-LegacyPackageFiles {
    Write-Host "🗑️  Removing legacy package files..." -ForegroundColor Yellow
    
    if (Test-Path "package.json") {
        Remove-Item "package.json" -Force
        Write-Host "   ✓ Deleted: package.json" -ForegroundColor Gray
    }
    
    if (Test-Path "package-lock.json") {
        Remove-Item "package-lock.json" -Force
        Write-Host "   ✓ Deleted: package-lock.json" -ForegroundColor Gray
    }
    
    if (Test-Path "node_modules") {
        Write-Host "   ⏳ Deleting node_modules/ (this may take a moment)..." -ForegroundColor Gray
        Remove-Item "node_modules" -Recurse -Force
        Write-Host "   ✓ Deleted: node_modules/" -ForegroundColor Gray
    }
}

function Remove-LegacyDeploymentFiles {
    Write-Host "🗑️  Removing legacy deployment files..." -ForegroundColor Yellow
    
    $files = @(
        "deploy-vercel.ps1",
        "deploy-vercel.sh",
        "vercel.json",
        ".vercelignore"
    )
    
    foreach ($file in $files) {
        if (Test-Path $file) {
            Remove-Item $file -Force
            Write-Host "   ✓ Deleted: $file" -ForegroundColor Gray
        }
    }
}

function Remove-LegacyDocs {
    Write-Host "🗑️  Removing legacy documentation..." -ForegroundColor Yellow
    
    $files = @(
        "START_HERE_DEPLOYMENT.md",
        "DEPLOYMENT_COMPLETE.md",
        "QUICK_DEPLOY_REFERENCE.md",
        "VERCEL_DEPLOYMENT.md",
        "VERCEL_FIXES_SUMMARY.md",
        "DEPLOYMENT_GUIDE.md",
        "README-PRODUCTION.md",
        "START_HERE.md",
        "QUICK_START.md",
        "ENCRYPTION_KEY_GUIDE.md",
        "PERSISTENT_LOCATION_GUIDE.md",
        "GPS_REQUIRED_GUIDE.md",
        "COOKIE_CONSENT_GUIDE.md",
        "FINAL_SUMMARY.md",
        "CUSTOMIZATION_GUIDE.md",
        "STEALTH_GUIDE.md"
    )
    
    foreach ($file in $files) {
        if (Test-Path $file) {
            Remove-Item $file -Force
            Write-Host "   ✓ Deleted: $file" -ForegroundColor Gray
        }
    }
}

function Archive-LegacyFiles {
    Write-Host "📦 Creating archive folder..." -ForegroundColor Yellow
    
    if (-not (Test-Path "archive-legacy")) {
        New-Item -ItemType Directory -Path "archive-legacy" | Out-Null
    }
    
    $allFiles = @(
        "server.js", "server.tmp", "database.js", "Procfile",
        "package.json", "package-lock.json",
        "deploy-vercel.ps1", "deploy-vercel.sh", "vercel.json", ".vercelignore"
    )
    
    $allFiles += @(
        "START_HERE_DEPLOYMENT.md", "DEPLOYMENT_COMPLETE.md",
        "QUICK_DEPLOY_REFERENCE.md", "VERCEL_DEPLOYMENT.md",
        "VERCEL_FIXES_SUMMARY.md", "DEPLOYMENT_GUIDE.md",
        "README-PRODUCTION.md", "START_HERE.md", "QUICK_START.md",
        "ENCRYPTION_KEY_GUIDE.md", "PERSISTENT_LOCATION_GUIDE.md",
        "GPS_REQUIRED_GUIDE.md", "COOKIE_CONSENT_GUIDE.md",
        "FINAL_SUMMARY.md", "CUSTOMIZATION_GUIDE.md", "STEALTH_GUIDE.md"
    )
    
    foreach ($file in $allFiles) {
        if (Test-Path $file) {
            Move-Item $file "archive-legacy/" -Force
            Write-Host "   ✓ Archived: $file" -ForegroundColor Gray
        }
    }
    
    if (Test-Path "api") {
        Move-Item "api" "archive-legacy/" -Force
        Write-Host "   ✓ Archived: api/" -ForegroundColor Gray
    }
    
    if (Test-Path "public") {
        New-Item -ItemType Directory -Path "archive-legacy/public" -Force | Out-Null
        $publicFiles = Get-ChildItem "public" -File
        foreach ($file in $publicFiles) {
            Move-Item $file.FullName "archive-legacy/public/" -Force
        }
        if (Test-Path "public/legacy") {
            Move-Item "public/legacy" "archive-legacy/public/" -Force
        }
        Write-Host "   ✓ Archived: public/ files" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "✅ Files archived to: archive-legacy/" -ForegroundColor Green
    Write-Host "   You can delete this folder later if everything works fine." -ForegroundColor Gray
}

Write-Host ""

switch ($choice) {
    "1" {
        Write-Host "🗑️  Cleaning everything..." -ForegroundColor Cyan
        Remove-LegacyServerFiles
        Remove-LegacyPublicFiles
        Remove-LegacyPackageFiles
        Remove-LegacyDeploymentFiles
        Remove-LegacyDocs
    }
    "2" {
        Remove-LegacyServerFiles
        Remove-LegacyPackageFiles
        Remove-LegacyDeploymentFiles
    }
    "3" {
        Remove-LegacyPublicFiles
    }
    "4" {
        Remove-LegacyDocs
    }
    "5" {
        Archive-LegacyFiles
    }
    "6" {
        Write-Host "❌ Cleanup cancelled." -ForegroundColor Red
        exit 0
    }
    default {
        Write-Host "❌ Invalid choice. Cleanup cancelled." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Test your Next.js app: cd nextjs-geolocation-tracker && npm run dev"
Write-Host "   2. Review changes: git status"
Write-Host "   3. Commit changes: git add . && git commit -m 'Clean up legacy files'"
Write-Host "   4. Push to remote: git push origin main"
Write-Host ""
Write-Host "💡 Tip: Your backup is in branch 'backup-before-cleanup'" -ForegroundColor Yellow
Write-Host "   To restore: git checkout backup-before-cleanup" -ForegroundColor Yellow
Write-Host ""

