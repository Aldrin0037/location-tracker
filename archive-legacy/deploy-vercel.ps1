# Vercel Deployment Script for Geolocation Tracker (PowerShell)
# This script helps you deploy to Vercel with proper configuration

Write-Host "🚀 Geolocation Tracker - Vercel Deployment" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found!" -ForegroundColor Red
    Write-Host "📦 Installing Vercel CLI globally..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed!" -ForegroundColor Green
    Write-Host ""
}

# Check if user is logged in
Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Yellow
try {
    $whoami = vercel whoami 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Please login to Vercel:" -ForegroundColor Yellow
        vercel login
        Write-Host ""
    }
} catch {
    Write-Host "Please login to Vercel:" -ForegroundColor Yellow
    vercel login
    Write-Host ""
}

Write-Host "✅ Authenticated!" -ForegroundColor Green
Write-Host ""

# Prompt for environment variables
Write-Host "🔧 Environment Variables Setup" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT: In production, you MUST set:" -ForegroundColor Yellow
Write-Host "   - ADMIN_USERNAME" -ForegroundColor Yellow
Write-Host "   - ADMIN_PASSWORD" -ForegroundColor Yellow
Write-Host ""

$setEnv = Read-Host "Do you want to set environment variables now? (y/n)"

if ($setEnv -eq "y" -or $setEnv -eq "Y") {
    Write-Host ""
    Write-Host "Setting ADMIN_USERNAME..." -ForegroundColor Yellow
    vercel env add ADMIN_USERNAME production
    
    Write-Host ""
    Write-Host "Setting ADMIN_PASSWORD..." -ForegroundColor Yellow
    vercel env add ADMIN_PASSWORD production
    
    Write-Host ""
    $useSupabase = Read-Host "Are you using Supabase? (y/n)"
    
    if ($useSupabase -eq "y" -or $useSupabase -eq "Y") {
        Write-Host ""
        Write-Host "Setting SUPABASE_URL..." -ForegroundColor Yellow
        vercel env add SUPABASE_URL production
        
        Write-Host ""
        Write-Host "Setting SUPABASE_ANON_KEY..." -ForegroundColor Yellow
        vercel env add SUPABASE_ANON_KEY production
    }
    
    Write-Host ""
    Write-Host "✅ Environment variables configured!" -ForegroundColor Green
}

Write-Host ""
Write-Host "📤 Deploying to Vercel..." -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
Write-Host ""

# Deploy
$deployProd = Read-Host "Deploy to production? (y/n)"

if ($deployProd -eq "y" -or $deployProd -eq "Y") {
    Write-Host ""
    Write-Host "🚀 Deploying to PRODUCTION..." -ForegroundColor Green
    vercel --prod
} else {
    Write-Host ""
    Write-Host "🧪 Deploying to PREVIEW (staging)..." -ForegroundColor Yellow
    vercel
}

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Open your deployment URL in a browser"
Write-Host "   2. Test the tracking pages (/photos, /track)"
Write-Host "   3. Test the admin dashboard (/admin)"
Write-Host "   4. Verify static assets load (CSS, JS)"
Write-Host "   5. Check browser console for errors"
Write-Host ""
Write-Host "🔗 Useful Commands:" -ForegroundColor Cyan
Write-Host "   vercel --prod          # Deploy to production"
Write-Host "   vercel                 # Deploy to preview"
Write-Host "   vercel logs            # View runtime logs"
Write-Host "   vercel env ls          # List environment variables"
Write-Host "   vercel domains         # Manage custom domains"
Write-Host ""
Write-Host "📚 Documentation: See VERCEL_DEPLOYMENT.md for full guide" -ForegroundColor Yellow
Write-Host ""

