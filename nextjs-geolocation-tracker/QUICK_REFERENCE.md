# 🚀 Quick Reference Guide

## 📍 Navigation

| Page | URL | Description | Auth Required |
|------|-----|-------------|---------------|
| Home | `/` | Redirects to `/photos` | ❌ |
| Photos | `/photos` | Photo gallery with tracking | ❌ |
| Track | `/track` | Stealth tracking page | ❌ |
| Share | `/share` | Share page | ❌ |
| Delivery | `/delivery` | Delivery tracking | ❌ |
| Admin Dashboard | `/admin` | Main admin dashboard | ✅ |
| Analytics | `/analytics` | Analytics & charts | ✅ |
| Settings | `/settings` | Privacy & configuration | ✅ |

---

## 🔌 API Endpoints

### Public Endpoints
```bash
POST /api/track              # Stealth tracking
POST /api/log-location       # Standard tracking with consent
GET  /api/health             # Health check
GET  /api/page-config/[path] # Get page configuration
```

### Admin Endpoints (Auth Required)
```bash
POST /api/admin/login        # Admin login
GET  /api/admin/tracks       # Get all tracks
GET  /api/admin/export       # Export data as JSON
GET  /api/admin/config       # Get configuration
POST /api/admin/config       # Update configuration
GET  /api/analytics          # Get analytics data
GET  /api/realtime           # Real-time tracking data
POST /api/realtime           # Long polling for updates
```

---

## 🎨 Components

### Map
```tsx
import Map from '../components/Map';

<Map
  latitude={37.7749}
  longitude={-122.4194}
  zoom={13}
  markers={[{ lat: 37.7749, lng: -122.4194, label: 'SF' }]}
  height="400px"
/>
```

### TrackingCard
```tsx
import TrackingCard from '../components/TrackingCard';

<TrackingCard
  track={trackData}
  showMap={true}
  onDelete={(id) => console.log('Delete', id)}
/>
```

### Layout
```tsx
import Layout from '../components/Layout';

<Layout showNavigation={true} showThemeToggle={true}>
  {children}
</Layout>
```

---

## 🎣 Hooks

### useRealTimeTracking
```tsx
const {
  tracks,           // Array of tracks
  isTracking,       // Boolean
  isLoading,        // Boolean
  error,            // String | null
  lastUpdate,       // Date | null
  startTracking,    // Function
  stopTracking,     // Function
  refresh           // Function
} = useRealTimeTracking({
  pollingInterval: 5000,
  autoStart: false
});
```

### useLiveLocation
```tsx
const {
  position,         // GeolocationPosition | null
  error,            // String | null
  isWatching,       // Boolean
  startWatching,    // Function
  stopWatching,     // Function
  getCurrentPosition // Async function
} = useLiveLocation({
  enableHighAccuracy: true,
  timeout: 10000
});
```

### useAuth
```tsx
const {
  isAuthenticated,  // Boolean
  isLoading,        // Boolean
  login,            // (username, password) => Promise<boolean>
  logout            // () => void
} = useAuth();
```

### useCookieConsent
```tsx
const {
  hasConsent,       // Boolean
  acceptCookies,    // () => void
  declineCookies    // () => void
} = useCookieConsent();
```

### useLocationTracking
```tsx
const {
  captureLocation,  // (url) => Promise<void>
  sendTrackingData, // (endpoint, url) => Promise<void>
  isLoading         // Boolean
} = useLocationTracking();
```

### useTheme
```tsx
const {
  theme,            // 'light' | 'dark'
  toggleTheme       // () => void
} = useTheme();
```

---

## 🔧 Environment Variables

```env
# Required
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
NODE_ENV=development

# Optional
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
```

---

## 📊 Analytics Metrics

### Overview Stats
- Total Tracks
- Unique IPs
- GPS Enabled Count & Percentage
- Average GPS Accuracy
- Last 24 Hours Activity

### Time-Based Stats
- Last 24 Hours
- Last 7 Days
- Last 30 Days

### Geographic Data
- Top 10 Countries
- Top 10 Cities

### Device Stats
- Desktop
- Mobile
- Tablet

### Charts
- Hourly Activity (24 hours)
- Daily Activity (30 days)

---

## ⚙️ Settings

### Privacy Controls
- ✅ Cookie Consent Management
- ✅ Enable/Disable Tracking
- ✅ GPS Tracking Toggle
- ✅ IP Tracking Toggle
- ✅ Data Retention Period

### Configuration
- ✅ Enable/Disable Tracking Pages
- ✅ Page URLs and Titles
- ✅ Real-time Updates

### Data Management
- ⚠️ Clear All Tracking Data

---

## 🎯 Common Tasks

### Start Development Server
```bash
cd nextjs-geolocation-tracker
npm run dev
```

### Build for Production
```bash
npm run build
npm run start
```

### Deploy to Vercel
```bash
vercel
```

### View Logs
```bash
vercel logs
```

### Export Tracking Data
1. Go to `/admin`
2. Click "📥 Export Data"
3. JSON file downloads automatically

### Clear Tracking Data
1. Go to `/settings`
2. Scroll to "Danger Zone"
3. Click "🗑️ Clear All Tracking Data"
4. Confirm action

---

## 🔒 Admin Credentials

**⚠️ SET THESE IN PRODUCTION!**

Set in `.env.local`:
```env
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_secure_password
```

---

## 🎨 Tailwind Classes Reference

### Buttons
```tsx
className="btn-primary"    // Amber button
className="btn-secondary"  // Gray button
```

### Cards
```tsx
className="card"           // White card with shadow
```

### Animations
```tsx
className="animate-fadeIn" // Fade in animation
```

---

## 📱 Responsive Breakpoints

```css
sm:  640px   /* Small devices */
md:  768px   /* Medium devices */
lg:  1024px  /* Large devices */
xl:  1280px  /* Extra large devices */
2xl: 1536px  /* 2X large devices */
```

---

## 🌙 Dark Mode Classes

```tsx
className="dark:bg-gray-800"     // Dark background
className="dark:text-gray-100"   // Dark text
className="dark:border-gray-700" // Dark border
```

---

## 🔍 Debugging

### Check if tracking is working
1. Open browser console
2. Go to `/track` or `/photos`
3. Look for tracking logs
4. Check `/admin` for new entries

### Check API responses
```bash
# Health check
curl http://localhost:3000/api/health

# Get tracks (requires auth)
curl http://localhost:3000/api/admin/tracks

# Get analytics (requires auth)
curl http://localhost:3000/api/analytics
```

---

## 📦 Project Structure

```
/app
  /api                    # API routes
    /admin               # Admin endpoints
    /analytics           # Analytics endpoint
    /realtime            # Real-time tracking
    /track               # Tracking endpoint
  /components            # React components
    Map.tsx
    TrackingCard.tsx
    Layout.tsx
    ThemeToggle.tsx
    CookieBanner.tsx
    LoadingSpinner.tsx
  /hooks                 # Custom hooks
    useRealTimeTracking.ts
    useAuth.ts
    useCookieConsent.ts
    useLocationTracking.ts
    useTheme.ts
  /lib                   # Utilities
    database.ts
    utils.ts
  /types                 # TypeScript types
    index.ts
  /admin                 # Admin page
  /analytics             # Analytics page
  /settings              # Settings page
  /photos                # Photos page
  /track                 # Track page
  /share                 # Share page
  /delivery              # Delivery page
  page.tsx              # Home page
  layout.tsx            # Root layout
  globals.css           # Global styles
```

---

## 🚨 Troubleshooting

### Issue: Can't login to admin
**Solution:** Check `.env.local` has correct credentials

### Issue: Maps not loading
**Solution:** Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` or use OpenStreetMap fallback

### Issue: Real-time updates not working
**Solution:** Check browser console for errors, verify API endpoint is accessible

### Issue: Dark mode not working
**Solution:** Clear localStorage and refresh page

### Issue: GPS not capturing
**Solution:** Ensure HTTPS is enabled (required for Geolocation API)

---

## 📚 Additional Resources

- [Main README](./README.md)
- [Enhancements Guide](./ENHANCEMENTS.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Security Guide](./SECURITY.md)

---

**Quick Start:**
```bash
npm install
npm run dev
# Visit http://localhost:3000
# Login at http://localhost:3000/admin
```

**Need Help?** Check the documentation or open an issue on GitHub.

