#!/bin/bash

# Vercel Deployment Script for Geolocation Tracker
# This script helps you deploy to Vercel with proper configuration

echo "🚀 Geolocation Tracker - Vercel Deployment"
echo "=========================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found!"
    echo "📦 Installing Vercel CLI globally..."
    npm install -g vercel
    echo "✅ Vercel CLI installed!"
    echo ""
fi

# Check if user is logged in
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
    echo ""
fi

echo "✅ Authenticated!"
echo ""

# Prompt for environment variables
echo "🔧 Environment Variables Setup"
echo "==============================="
echo ""
echo "⚠️  IMPORTANT: In production, you MUST set:"
echo "   - ADMIN_USERNAME"
echo "   - ADMIN_PASSWORD"
echo ""
read -p "Do you want to set environment variables now? (y/n): " set_env

if [[ $set_env == "y" || $set_env == "Y" ]]; then
    echo ""
    echo "Setting ADMIN_USERNAME..."
    vercel env add ADMIN_USERNAME production
    
    echo ""
    echo "Setting ADMIN_PASSWORD..."
    vercel env add ADMIN_PASSWORD production
    
    echo ""
    read -p "Are you using Supabase? (y/n): " use_supabase
    
    if [[ $use_supabase == "y" || $use_supabase == "Y" ]]; then
        echo ""
        echo "Setting SUPABASE_URL..."
        vercel env add SUPABASE_URL production
        
        echo ""
        echo "Setting SUPABASE_ANON_KEY..."
        vercel env add SUPABASE_ANON_KEY production
    fi
    
    echo ""
    echo "✅ Environment variables configured!"
fi

echo ""
echo "📤 Deploying to Vercel..."
echo "=========================="
echo ""

# Deploy
read -p "Deploy to production? (y/n): " deploy_prod

if [[ $deploy_prod == "y" || $deploy_prod == "Y" ]]; then
    echo ""
    echo "🚀 Deploying to PRODUCTION..."
    vercel --prod
else
    echo ""
    echo "🧪 Deploying to PREVIEW (staging)..."
    vercel
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Open your deployment URL in a browser"
echo "   2. Test the tracking pages (/photos, /track)"
echo "   3. Test the admin dashboard (/admin)"
echo "   4. Verify static assets load (CSS, JS)"
echo "   5. Check browser console for errors"
echo ""
echo "🔗 Useful Commands:"
echo "   vercel --prod          # Deploy to production"
echo "   vercel                 # Deploy to preview"
echo "   vercel logs            # View runtime logs"
echo "   vercel env ls          # List environment variables"
echo "   vercel domains         # Manage custom domains"
echo ""
echo "📚 Documentation: See VERCEL_DEPLOYMENT.md for full guide"
echo ""

