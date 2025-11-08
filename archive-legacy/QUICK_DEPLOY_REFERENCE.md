# ⚡ Quick Deploy Reference Card

## 🚀 Deploy in 3 Steps

### Step 1: Install & Login
```bash
npm install -g vercel
vercel login
```

### Step 2: Set Environment Variables
```bash
vercel env add ADMIN_USERNAME production
vercel env add ADMIN_PASSWORD production
```

### Step 3: Deploy
```bash
vercel --prod
```

**Done!** Your app is live at the URL shown in terminal.

---

## 📝 What Changed

### server.js (Bottom of file)
```diff
- // Start server
- app.listen(PORT, () => {
-   console.log('🚀 Server running...');
- });

+ // Start server (only when not in serverless)
+ if (require.main === module) {
+   app.listen(PORT, () => {
+     console.log('🚀 Server running...');
+   });
+ }
+ 
+ // Export for Vercel
+ module.exports = app;
```

### vercel.json (Routes section)
```diff
- "routes": [
-   { "src": "/api/(.*)", "dest": "/server.js" },
-   { "src": "/(admin|track|...)", "dest": "/server.js" },
-   { "src": "/(.*\\.(css|...)$)", "dest": "/public/$1" },
-   ...multiple routes...
- ]

+ "routes": [
+   {
+     "src": "/(.+\\.(css|js|html|png|jpg|...))",
+     "dest": "/public/$1"
+   },
+   {
+     "src": "/(.*)",
+     "dest": "/server.js"
+   }
+ ]
```

---

## ✅ Quick Test Checklist

After deploying, test these 3 things:

1. **Homepage loads with styling**
   ```
   https://your-app.vercel.app/photos
   ✅ Should be styled (not plain HTML)
   ```

2. **Admin dashboard accessible**
   ```
   https://your-app.vercel.app/admin
   ✅ Login with your credentials
   ```

3. **Static files load (check DevTools)**
   ```
   F12 → Network tab
   ✅ CSS files: 200 OK (not 404)
   ✅ JS files: 200 OK (not 404)
   ```

---

## 🔧 Common Commands

```bash
# Deploy to production
vercel --prod

# Deploy to preview (staging)
vercel

# View logs
vercel logs

# List environment variables
vercel env ls

# Force redeploy (clear cache)
vercel --prod --force

# Open project in browser
vercel open
```

---

## 🐛 Quick Fixes

**CSS/JS still not loading?**
```bash
# Clear cache and redeploy
vercel --prod --force
```

**Environment variable error?**
```bash
# Set required variables
vercel env add ADMIN_USERNAME production
vercel env add ADMIN_PASSWORD production
vercel --prod
```

**Server not responding?**
```bash
# Check logs
vercel logs
```

---

## 📁 Files You Can Reference

- `DEPLOYMENT_COMPLETE.md` - Start here
- `VERCEL_DEPLOYMENT.md` - Full detailed guide
- `VERCEL_FIXES_SUMMARY.md` - Technical explanation
- `deploy-vercel.ps1` - Automated script (Windows)
- `deploy-vercel.sh` - Automated script (Mac/Linux)

---

## 💡 Pro Tips

1. **Use the deployment script** for guided setup:
   ```powershell
   .\deploy-vercel.ps1    # Windows
   ```
   ```bash
   ./deploy-vercel.sh     # Mac/Linux
   ```

2. **Connect to GitHub** for auto-deploy:
   - Every push to `main` automatically deploys
   - No need to run `vercel` command manually

3. **Use preview deployments** for testing:
   ```bash
   vercel  # Creates preview URL for testing
   ```

4. **Check build logs** if something fails:
   - Visit Vercel dashboard
   - Click on failed deployment
   - View detailed build logs

---

## 🎯 Your Deployment URL

After running `vercel --prod`, you'll get:

```
✅ Production: https://geolocation-tracker.vercel.app
```

Or set custom domain in Vercel dashboard.

---

**That's it!** For detailed information, see `DEPLOYMENT_COMPLETE.md`

🚀 Happy deploying!

