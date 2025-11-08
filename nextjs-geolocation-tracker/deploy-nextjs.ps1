# Next.js Deployment Script for Vercel
# Automated deployment with environment variable setup

Write-Host "`n🚀 Next.js Geolocation Tracker - Vercel Deployment" -ForegroundColor Cyan
Write-Host "===================================================`n" -ForegroundColor Cyan

# Check if in correct directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found!" -ForegroundColor Red
    Write-Host "Please run this script from the nextjs-geolocation-tracker directory" -ForegroundColor Yellow
    exit 1
}

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found!" -ForegroundColor Red
    Write-Host "📦 Installing Vercel CLI globally..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed!`n" -ForegroundColor Green
}

# Check authentication
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

Write-Host "✅ Authenticated!`n" -ForegroundColor Green

# Build check
Write-Host "🔨 Running production build check..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Build failed! Fix errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Build successful!`n" -ForegroundColor Green

# Environment variables
Write-Host "🔧 Environment Variables Setup" -ForegroundColor Cyan
Write-Host "==============================`n" -ForegroundColor Cyan

$setEnv = Read-Host "Set environment variables? (y/n)"

if ($setEnv -eq "y" -or $setEnv -eq "Y") {
    Write-Host "`nSetting ADMIN_USERNAME..." -ForegroundColor Yellow
    vercel env add ADMIN_USERNAME production
    
    Write-Host "`nSetting ADMIN_PASSWORD..." -ForegroundColor Yellow
    vercel env add ADMIN_PASSWORD production
    
    Write-Host "`n✅ Environment variables configured!`n" -ForegroundColor Green
}

# Deploy
Write-Host "📤 Ready to Deploy" -ForegroundColor Cyan
Write-Host "==================`n" -ForegroundColor Cyan

$deployProd = Read-Host "Deploy to production? (y/n)"

if ($deployProd -eq "y" -or $deployProd -eq "Y") {
    Write-Host "`n🚀 Deploying to PRODUCTION...`n" -ForegroundColor Green
    vercel --prod
} else {
    Write-Host "`n🧪 Deploying to PREVIEW...`n" -ForegroundColor Yellow
    vercel
}

Write-Host "`n✅ Deployment complete!`n" -ForegroundColor Green

Write-Host "📋 Post-Deployment Checklist:" -ForegroundColor Cyan
Write-Host "  1. Visit your deployment URL" -ForegroundColor White
Write-Host "  2. Test /photos page (cookie consent + tracking)" -ForegroundColor White
Write-Host "  3. Test /track page (stealth mode)" -ForegroundColor White
Write-Host "  4. Test /admin dashboard (login + data view)" -ForegroundColor White
Write-Host "  5. Check browser console for errors" -ForegroundColor White
Write-Host "  6. Verify API endpoints work" -ForegroundColor White
Write-Host "  7. Test dark mode toggle`n" -ForegroundColor White

Write-Host "🔗 Useful Commands:" -ForegroundColor Cyan
Write-Host "  vercel --prod              # Deploy to production" -ForegroundColor White
Write-Host "  vercel logs                # View runtime logs" -ForegroundColor White
Write-Host "  vercel env ls              # List environment variables" -ForegroundColor White
Write-Host "  vercel domains             # Manage domains`n" -ForegroundColor White

Write-Host "📚 Documentation: See README.md and DEPLOYMENT.md`n" -ForegroundColor Yellow

Write-Host "===================================================`n" -ForegroundColor Cyan
Write-Host "🎉 Your Next.js app is deployed!" -ForegroundColor Green
Write-Host "===================================================`n" -ForegroundColor Cyan

