# 📁 Project Structure

## 🗂️ Complete Directory Tree

```
nextjs-geolocation-tracker/
│
├── 📄 Configuration Files
│   ├── .env.local                    # Environment variables
│   ├── next.config.ts                # Next.js configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── postcss.config.mjs            # PostCSS configuration
│   ├── eslint.config.mjs             # ESLint configuration
│   ├── package.json                  # Dependencies
│   ├── config.json                   # App configuration
│   └── vercel.json                   # Vercel deployment config
│
├── 📚 Documentation
│   ├── README.md                     # Main documentation
│   ├── WHATS_NEW.md                  # What's new in v2.0
│   ├── FEATURES_SUMMARY.md           # Features overview
│   ├── ENHANCEMENTS.md               # Detailed enhancements
│   ├── QUICK_REFERENCE.md            # Quick reference guide
│   ├── PROJECT_STRUCTURE.md          # This file
│   ├── DEPLOYMENT.md                 # Deployment guide
│   └── SECURITY.md                   # Security guidelines
│
├── 📦 app/                           # Next.js App Directory
│   │
│   ├── 🎨 components/                # React Components
│   │   ├── Map.tsx                   # ✨ NEW: Interactive map
│   │   ├── TrackingCard.tsx          # ✨ NEW: Tracking display card
│   │   ├── Layout.tsx                # ⚡ ENHANCED: With navigation
│   │   ├── ThemeToggle.tsx           # Dark mode toggle
│   │   ├── CookieBanner.tsx          # Cookie consent banner
│   │   └── LoadingSpinner.tsx        # Loading indicator
│   │
│   ├── 🎣 hooks/                     # Custom React Hooks
│   │   ├── useRealTimeTracking.ts    # ✨ NEW: Real-time polling
│   │   ├── useAuth.ts                # Authentication hook
│   │   ├── useCookieConsent.ts       # Cookie consent hook
│   │   ├── useLocationTracking.ts    # Location tracking hook
│   │   └── useTheme.ts               # Theme management hook
│   │
│   ├── 🔌 api/                       # API Routes (Serverless Functions)
│   │   ├── analytics/
│   │   │   └── route.ts              # ✨ NEW: Analytics endpoint
│   │   ├── realtime/
│   │   │   └── route.ts              # ✨ NEW: Real-time endpoint
│   │   ├── admin/
│   │   │   ├── login/route.ts        # Admin login
│   │   │   ├── tracks/route.ts       # Get/delete tracks
│   │   │   ├── export/route.ts       # Export data
│   │   │   └── config/route.ts       # Configuration
│   │   ├── track/route.ts            # Stealth tracking
│   │   ├── log-location/route.ts     # Standard tracking
│   │   ├── page-config/
│   │   │   └── [...path]/route.ts    # Dynamic page config
│   │   └── health/route.ts           # Health check
│   │
│   ├── 📄 Pages
│   │   ├── admin/
│   │   │   └── page.tsx              # ⚡ ENHANCED: Admin dashboard
│   │   ├── analytics/
│   │   │   └── page.tsx              # ✨ NEW: Analytics dashboard
│   │   ├── settings/
│   │   │   └── page.tsx              # ✨ NEW: Settings page
│   │   ├── photos/
│   │   │   └── page.tsx              # Photo gallery with tracking
│   │   ├── track/
│   │   │   └── page.tsx              # Stealth tracking page
│   │   ├── share/
│   │   │   └── page.tsx              # Share page
│   │   ├── delivery/
│   │   │   └── page.tsx              # Delivery tracking
│   │   └── page.tsx                  # Home (redirects to /photos)
│   │
│   ├── 🛠️ lib/                       # Utilities & Database
│   │   ├── database.ts               # Database operations
│   │   └── utils.ts                  # Utility functions
│   │
│   ├── 📝 types/                     # TypeScript Type Definitions
│   │   └── index.ts                  # All type definitions
│   │
│   ├── 🎨 Styles
│   │   └── globals.css               # Global styles & Tailwind
│   │
│   └── 📄 Root Files
│       ├── layout.tsx                # Root layout
│       └── favicon.ico               # Favicon
│
├── 🌐 public/                        # Static Assets
│   ├── *.svg                         # SVG icons
│   └── ...                           # Other static files
│
├── 📊 Data
│   └── tracking-data.json            # Tracking data storage
│
└── 🔧 middleware.ts                  # Next.js middleware (rate limiting)
```

---

## 🎯 Key Directories Explained

### `/app/components/` - React Components
**Purpose:** Reusable UI components

| Component | Purpose | New? |
|-----------|---------|------|
| Map | Interactive location maps | ✨ Yes |
| TrackingCard | Display tracking entries | ✨ Yes |
| Layout | Page layout with navigation | ⚡ Enhanced |
| ThemeToggle | Dark mode toggle | No |
| CookieBanner | Cookie consent | No |
| LoadingSpinner | Loading indicator | No |

---

### `/app/hooks/` - Custom Hooks
**Purpose:** Reusable React logic

| Hook | Purpose | New? |
|------|---------|------|
| useRealTimeTracking | Real-time data polling | ✨ Yes |
| useLiveLocation | GPS tracking | ✨ Yes |
| useAuth | Authentication | No |
| useCookieConsent | Cookie management | No |
| useLocationTracking | Location capture | No |
| useTheme | Theme management | No |

---

### `/app/api/` - API Routes
**Purpose:** Backend endpoints (serverless functions)

| Endpoint | Method | Purpose | New? |
|----------|--------|---------|------|
| /api/analytics | GET | Analytics data | ✨ Yes |
| /api/realtime | GET/POST | Real-time tracking | ✨ Yes |
| /api/admin/login | POST | Admin authentication | No |
| /api/admin/tracks | GET/DELETE | Track management | No |
| /api/admin/export | GET | Export data | No |
| /api/admin/config | GET/POST | Configuration | No |
| /api/track | POST | Stealth tracking | No |
| /api/log-location | POST | Standard tracking | No |
| /api/health | GET | Health check | No |

---

### `/app/` Pages
**Purpose:** Application routes

| Page | URL | Purpose | Auth? | New? |
|------|-----|---------|-------|------|
| Home | `/` | Redirects to /photos | ❌ | No |
| Photos | `/photos` | Photo gallery | ❌ | No |
| Track | `/track` | Stealth tracking | ❌ | No |
| Share | `/share` | Share page | ❌ | No |
| Delivery | `/delivery` | Delivery tracking | ❌ | No |
| Admin | `/admin` | Admin dashboard | ✅ | ⚡ Enhanced |
| Analytics | `/analytics` | Analytics dashboard | ✅ | ✨ Yes |
| Settings | `/settings` | Settings & privacy | ✅ | ✨ Yes |

---

## 🔄 Data Flow

### Tracking Flow
```
User visits page
    ↓
Location captured (GPS/IP)
    ↓
Sent to /api/track or /api/log-location
    ↓
Stored in tracking-data.json
    ↓
Visible in admin dashboard
```

### Real-Time Updates Flow
```
useRealTimeTracking hook
    ↓
Polls /api/realtime every 5 seconds
    ↓
Fetches new tracking data
    ↓
Updates UI automatically
```

### Analytics Flow
```
User visits /analytics
    ↓
Fetches data from /api/analytics
    ↓
Processes statistics
    ↓
Displays charts and metrics
```

---

## 🎨 Component Hierarchy

### Admin Pages Layout
```
Layout (with navigation)
  ├── Navigation Bar
  │   ├── Dashboard Link
  │   ├── Analytics Link
  │   └── Settings Link
  └── Page Content
      ├── Admin Dashboard
      │   ├── Stats Cards
      │   ├── Actions
      │   └── Tracks Table
      ├── Analytics Dashboard
      │   ├── Overview Stats
      │   ├── Time Stats
      │   ├── Charts
      │   └── Geographic Data
      └── Settings Page
          ├── Privacy Settings
          ├── Page Configuration
          └── Danger Zone
```

---

## 📦 Dependencies

### Core Dependencies
- **next** - Next.js framework
- **react** - React library
- **typescript** - TypeScript
- **tailwindcss** - Utility-first CSS

### Key Features
- Server Components
- API Routes
- Middleware
- TypeScript support
- Tailwind CSS

---

## 🔧 Configuration Files

### `.env.local` (Required)
```env
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_secure_password
NODE_ENV=development
```

### `.env.local` (Optional)
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
```

### `config.json`
Application configuration for tracking pages

### `tracking-data.json`
Stores all tracking data (can be replaced with database)

---

## 🚀 Build Output

### Development
```bash
npm run dev
# Runs on http://localhost:3000
```

### Production
```bash
npm run build
# Creates .next/ directory with optimized build

npm run start
# Serves production build
```

---

## 📊 File Statistics

### New Files Added (v2.0)
- ✅ 2 Components (Map, TrackingCard)
- ✅ 1 Hook file (useRealTimeTracking with 2 hooks)
- ✅ 2 Pages (Analytics, Settings)
- ✅ 2 API Routes (Analytics, Real-time)
- ✅ 4 Documentation files

### Enhanced Files
- ⚡ Layout.tsx (added navigation)
- ⚡ Admin page (added navigation prop)
- ⚡ README.md (updated features)

### Total New Code
- ~2,000+ lines of TypeScript/TSX
- ~1,500+ lines of documentation
- 100% TypeScript coverage
- Full dark mode support

---

## 🎯 File Naming Conventions

### Components
- PascalCase: `Map.tsx`, `TrackingCard.tsx`
- Default export

### Hooks
- camelCase with 'use' prefix: `useRealTimeTracking.ts`
- Named exports

### API Routes
- `route.ts` in folder structure
- Named exports (GET, POST, etc.)

### Pages
- `page.tsx` in folder structure
- Default export

### Types
- `index.ts` in `/types` folder
- Named exports

---

## 🔍 Quick Find

### Need to...

**Add a new page?**
→ Create `/app/your-page/page.tsx`

**Add a new API route?**
→ Create `/app/api/your-route/route.ts`

**Add a new component?**
→ Create `/app/components/YourComponent.tsx`

**Add a new hook?**
→ Create `/app/hooks/useYourHook.ts`

**Add types?**
→ Edit `/app/types/index.ts`

**Modify styles?**
→ Edit `/app/globals.css`

**Configure app?**
→ Edit `config.json`

**Set environment variables?**
→ Edit `.env.local`

---

## 📚 Related Documentation

- [WHATS_NEW.md](./WHATS_NEW.md) - Latest features
- [FEATURES_SUMMARY.md](./FEATURES_SUMMARY.md) - Feature overview
- [ENHANCEMENTS.md](./ENHANCEMENTS.md) - Detailed docs
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick reference
- [README.md](./README.md) - Main docs

---

**Last Updated:** November 8, 2024  
**Version:** 2.0.0  
**Structure:** Next.js 13+ App Router

