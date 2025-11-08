# 🚀 Vercel Deployment Guide - Geolocation Tracker

## ✅ What Was Fixed

### The Problem
Your app loaded as plain HTML without CSS/JS because:
1. **Missing Export**: `server.js` only used `app.listen()` which works locally but not on Vercel's serverless platform
2. **Static Asset Routing**: Vercel couldn't properly serve files from the `/public` directory

### The Solution
1. ✅ **Updated `server.js`**: Now exports the Express app for Vercel while maintaining local development compatibility
2. ✅ **Optimized `vercel.json`**: Cleaner routing configuration that properly handles static assets
3. ✅ **Environment Detection**: Server only calls `app.listen()` when running locally, not on Vercel

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure you have:

- [ ] A Vercel account (free tier works: https://vercel.com/signup)
- [ ] Vercel CLI installed (for CLI deployment): `npm i -g vercel`
- [ ] Git repository initialized (recommended but not required)
- [ ] Environment variables ready:
  - `ADMIN_USERNAME` (required in production)
  - `ADMIN_PASSWORD` (required in production)
  - `SUPABASE_URL` (if using Supabase)
  - `SUPABASE_ANON_KEY` (if using Supabase)
  - `ENCRYPTION_KEY` (if using encryption)

---

## 🌐 Method 1: Deploy via Vercel Web UI (Recommended for Beginners)

### Step 1: Prepare Your Repository
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Fix Vercel deployment configuration"

# Push to GitHub/GitLab/Bitbucket
# (Create a new repo on GitHub first, then:)
git remote add origin https://github.com/YOUR_USERNAME/geolocation-tracker.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to https://vercel.com/new
2. Click **"Import Project"**
3. Select your Git provider (GitHub/GitLab/Bitbucket)
4. Choose your `geolocation-tracker` repository
5. Click **"Import"**

### Step 3: Configure Environment Variables
1. In the import screen, expand **"Environment Variables"**
2. Add the following (click "+ Add Another" for each):
   ```
   ADMIN_USERNAME = your_secure_username
   ADMIN_PASSWORD = your_secure_password
   NODE_ENV = production
   ```
3. If using Supabase, also add:
   ```
   SUPABASE_URL = your_supabase_project_url
   SUPABASE_ANON_KEY = your_supabase_anon_key
   ```

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait 1-2 minutes for the build to complete
3. Your app will be live at: `https://geolocation-tracker-XXXXX.vercel.app`

### Step 5: Set Custom Domain (Optional)
1. Go to your project dashboard
2. Click **"Settings"** → **"Domains"**
3. Add: `geolocation-tracker.vercel.app` or your custom domain
4. Follow the DNS configuration instructions

---

## 💻 Method 2: Deploy via Vercel CLI (Recommended for Developers)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
Follow the browser authentication flow.

### Step 3: Deploy from Project Root
```bash
# Navigate to project directory
cd path/to/geolocation-tracker

# Deploy (first time - staging)
vercel

# Follow the prompts:
# ? Set up and deploy? Yes
# ? Which scope? (Select your account)
# ? Link to existing project? No
# ? What's your project's name? geolocation-tracker
# ? In which directory is your code located? ./
```

### Step 4: Add Environment Variables
```bash
# Set environment variables
vercel env add ADMIN_USERNAME production
# (Enter your secure username when prompted)

vercel env add ADMIN_PASSWORD production
# (Enter your secure password when prompted)

# If using Supabase
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
```

### Step 5: Deploy to Production
```bash
# Deploy to production
vercel --prod
```

Your app is now live! The CLI will output your production URL.

---

## 🔄 Redeploying After Changes

### Via Web UI (Auto-Deploy)
If you connected via Git, every push to `main` branch auto-deploys:
```bash
git add .
git commit -m "Update feature"
git push origin main
```
Vercel automatically detects and deploys changes.

### Via CLI (Manual Deploy)
```bash
# From project directory
vercel --prod
```

### Force Clean Redeploy
```bash
# Remove vercel cache and redeploy
vercel --prod --force
```

---

## 🧪 Testing Your Deployment

After deployment, test these URLs:

1. **Homepage** (redirects to /photos):
   ```
   https://your-app.vercel.app/
   ```

2. **Tracking Pages**:
   ```
   https://your-app.vercel.app/photos
   https://your-app.vercel.app/track
   ```

3. **Admin Dashboard**:
   ```
   https://your-app.vercel.app/admin
   ```
   Login with your `ADMIN_USERNAME` and `ADMIN_PASSWORD`

4. **Static Assets** (should load properly):
   ```
   https://your-app.vercel.app/track-styles.css
   https://your-app.vercel.app/track.js
   ```

5. **API Health Check**:
   ```
   https://your-app.vercel.app/health
   ```
   Should return: `{"status":"OK","timestamp":"..."}`

---

## 🔧 Common Deployment Issues & Fixes

### Issue 1: "ADMIN_USERNAME and ADMIN_PASSWORD must be set"
**Fix**: Add environment variables in Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add `ADMIN_USERNAME` and `ADMIN_PASSWORD`
3. Redeploy: `vercel --prod` or push to Git

### Issue 2: Static Files Still Not Loading
**Fix**: Check browser console for 404 errors. The file path should be:
- ✅ Correct: `/track-styles.css`
- ❌ Wrong: `/public/track-styles.css`

Ensure your HTML files reference assets without `/public/`:
```html
<!-- Correct -->
<link rel="stylesheet" href="/track-styles.css">
<script src="/track.js"></script>

<!-- Wrong -->
<link rel="stylesheet" href="/public/track-styles.css">
```

### Issue 3: Database Connection Errors
**Fix**: Ensure Supabase environment variables are set:
```bash
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
```
Then redeploy.

### Issue 4: "Function Execution Timeout"
**Fix**: Already configured in `vercel.json` (10s max). If you need more:
```json
"functions": {
  "server.js": {
    "maxDuration": 30
  }
}
```
Note: Free tier supports max 10s, Pro tier supports up to 60s.

### Issue 5: CORS Errors
**Fix**: Already handled with `app.use(cors())` in server.js. If issues persist:
```javascript
app.use(cors({
  origin: ['https://your-domain.vercel.app'],
  credentials: true
}));
```

---

## 📊 Vercel Dashboard Features

After deployment, access:

- **Deployments**: View all deployments and rollback if needed
- **Analytics**: Track visitor stats (Pro plan)
- **Logs**: View runtime logs for debugging
- **Environment Variables**: Manage secrets
- **Domains**: Configure custom domains
- **Settings**: Adjust build & deployment settings

Dashboard URL: https://vercel.com/dashboard

---

## 🎯 Quick Commands Reference

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview (staging)
vercel

# Deploy to production
vercel --prod

# Force redeploy (clears cache)
vercel --prod --force

# View logs
vercel logs

# Add environment variable
vercel env add VARIABLE_NAME production

# List environment variables
vercel env ls

# Remove a deployment
vercel remove DEPLOYMENT_URL

# Open project in browser
vercel open
```

---

## 🚨 Security Reminders

1. ✅ **Always set strong credentials** in environment variables
2. ✅ **Never commit** `.env` files or secrets to Git
3. ✅ **Use HTTPS** (Vercel provides this automatically)
4. ✅ **Review access logs** regularly in admin dashboard
5. ✅ **Understand legal implications** of location tracking
6. ✅ **Obtain explicit consent** from users before tracking

---

## 📞 Need Help?

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Check Build Logs**: `vercel logs` or in dashboard
- **Test Locally First**: `npm start` to verify changes work

---

## ✨ Success!

Your Geolocation Tracker should now be live at:
```
https://geolocation-tracker.vercel.app
```

Or your custom domain. Enjoy! 🎉

---

**⚖️ Legal Disclaimer**: This application is for educational purposes only. Always obtain explicit informed consent before tracking user locations. Unauthorized tracking is illegal and unethical in most jurisdictions.

