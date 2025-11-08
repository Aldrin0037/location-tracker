# Quick Start Guide

## 🚀 Get Running in 3 Minutes

### Step 1: Install Dependencies (if not already done)
```bash
cd nextjs-geolocation-tracker
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

The app will be available at **http://localhost:3000**

### Step 3: Test the Features

#### 📸 Test Tracking Page
1. Open **http://localhost:3000/photos**
2. Accept cookie consent
3. Allow location access when prompted
4. Watch content unlock after tracking

#### 🕵️ Test Stealth Mode
1. Open **http://localhost:3000/track**
2. No cookie banner (stealth!)
3. Auto-tracking in background
4. Content displays seamlessly

#### 🔐 Test Admin Dashboard
1. Open **http://localhost:3000/admin**
2. Login with your configured credentials
3. View tracked locations
4. Check statistics
5. Export data as JSON

#### 🧪 Test API Endpoints
```bash
# Health check
curl http://localhost:3000/api/health

# Should return: {"status":"OK","timestamp":"..."}
```

## 📝 Environment Variables

Create `.env.local` (already created):
```bash
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_secure_password
NODE_ENV=development
```

**⚠️ IMPORTANT**: Use strong credentials in production!

## 🎨 Available Pages

| Page | URL | Description |
|------|-----|-------------|
| Homepage | `/` | Redirects to `/photos` |
| Photos Gallery | `/photos` | Dynamic tracking with consent |
| Stealth Track | `/track` | Silent tracking mode |
| Admin Dashboard | `/admin` | View tracks & statistics |

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎯 Key Features to Test

### Location Tracking
- [x] GPS coordinate capture
- [x] IP-based fallback
- [x] Device fingerprinting
- [x] Timestamp recording

### User Experience
- [x] Cookie consent banner
- [x] Dark/light theme toggle
- [x] Loading spinners
- [x] Responsive design

### Admin Features
- [x] Authentication
- [x] Track viewing
- [x] Statistics dashboard
- [x] Data export

### API Features
- [x] Rate limiting
- [x] Error handling
- [x] Type validation
- [x] JSON responses

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 npm run dev
```

### Location Not Working
- Ensure HTTPS or localhost (required for geolocation API)
- Check browser console for permission errors
- Try different browser if issues persist

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Try building again
npm run build
```

### TypeScript Errors
```bash
# Check TypeScript
npx tsc --noEmit

# Check specific file
npx tsc --noEmit app/page.tsx
```

## 📚 Next Steps

1. ✅ **Customize Branding**
   - Edit page titles in each page component
   - Update colors in `tailwind.config.ts`
   - Modify layouts in `app/components/Layout.tsx`

2. ✅ **Configure Tracking**
   - Edit `config.json` for page themes
   - Adjust rate limits in `middleware.ts`
   - Customize tracking fields in types

3. ✅ **Prepare for Deployment**
   - Review `DEPLOYMENT.md`
   - Set strong admin credentials
   - Configure environment variables
   - Test build: `npm run build`

4. ✅ **Deploy to Vercel**
   - Push to GitHub
   - Import in Vercel
   - Add environment variables
   - Deploy!

## 🔒 Security Checklist

Before going live:

- [ ] Changed default admin credentials
- [ ] Set environment variables in Vercel
- [ ] Added privacy policy
- [ ] Enabled HTTPS (automatic on Vercel)
- [ ] Reviewed rate limits
- [ ] Tested all authentication flows
- [ ] Complied with GDPR/CCPA requirements

## 📖 Documentation

- **README.md** - Full project documentation
- **DEPLOYMENT.md** - Deployment guide
- **COMPARISON.md** - Express vs Next.js comparison
- **MIGRATION_SUMMARY.md** - Migration details

## 💡 Tips

1. **Hot Reload**: Save any file and see changes instantly
2. **TypeScript**: Hover over variables to see types
3. **Errors**: Check terminal and browser console
4. **Network**: Use DevTools Network tab to debug API calls
5. **State**: Use React DevTools browser extension

## 🎉 You're Ready!

Your Next.js Geolocation Tracker is running! Start building, testing, and customizing.

**Need help?** Check the documentation or review the code comments.

---

**Happy Tracking! 📍**

