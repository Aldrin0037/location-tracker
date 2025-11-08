# 🎯 Features Documentation

## Overview

The Next.js Geolocation Tracker is a comprehensive location tracking solution with both overt (consent-based) and stealth tracking capabilities.

---

## 🗺️ Core Features

### 1. GPS Location Tracking

**Description**: Capture precise GPS coordinates from user's device

**Implementation**: `useLocationTracking` hook

**How it works**:
```typescript
const { captureLocation, latitude, longitude, accuracy } = useLocationTracking();

// Capture location
const success = await captureLocation();

// Access coordinates
console.log(`Location: ${latitude}, ${longitude}`);
console.log(`Accuracy: ±${accuracy} meters`);
```

**Browser API**: Uses `navigator.geolocation.getCurrentPosition()`

**Accuracy**:
- Mobile: 5-50 meters (with GPS)
- Desktop: 100-1000 meters (WiFi/IP based)

**Requirements**:
- HTTPS or localhost
- User permission
- GPS/location services enabled

---

### 2. IP-Based Geolocation

**Description**: Fallback location tracking using IP address

**API**: ip-api.com (free, no API key required)

**Data Collected**:
- City
- Region/State
- Country
- ISP
- Approximate coordinates
- IP address

**Accuracy**: City-level (5-50 km radius)

**Usage**:
```typescript
const response = await fetch(`http://ip-api.com/json/${clientIP}`);
const ipLocation = await response.json();
```

---

### 3. Device Fingerprinting

**Description**: Generate unique identifier for each device

**Method**: Canvas fingerprinting + browser characteristics

**Data Points**:
- User Agent
- Screen resolution
- Language
- Timezone
- Color depth
- Storage support
- Canvas data

**Implementation**:
```typescript
function generateFingerprint(): string {
  // Combines multiple browser characteristics
  // Returns unique hash string
}
```

**Privacy**: Fingerprint is one-way hashed, no PII stored

---

### 4. Cookie Consent Management

**Component**: `CookieBanner.tsx`

**Hook**: `useCookieConsent()`

**Features**:
- GDPR-compliant consent banner
- Persistent consent storage (365 days)
- Consent checking before tracking
- Revoke consent functionality

**Usage**:
```typescript
const { hasConsent, giveConsent, revokeConsent } = useCookieConsent();

if (hasConsent) {
  // Proceed with tracking
}
```

---

### 5. Dark Mode Support

**Component**: `ThemeToggle.tsx`

**Hook**: `useTheme()`

**Features**:
- System preference detection
- localStorage persistence
- Smooth transitions
- Tailwind dark: classes

**Implementation**:
```typescript
const { isDark, toggleTheme } = useTheme();

// Toggle theme
toggleTheme();

// Set specific theme
setTheme(true); // dark mode
```

**CSS Classes**:
```css
/* Automatically switches based on dark class */
.bg-white dark:bg-gray-800
.text-gray-800 dark:text-gray-200
```

---

### 6. Rate Limiting

**Implementation**: Next.js Middleware

**File**: `middleware.ts`

**Limits**:
- 100 requests per 15 minutes (general)
- 10 location logs per 5 minutes (tracking)

**How it works**:
```typescript
// Middleware intercepts all API requests
// Checks rate limit per IP address
// Returns 429 if limit exceeded
```

**Bypass**: Not possible (enforced at edge)

---

### 7. Admin Dashboard

**Route**: `/admin`

**Features**:
- 🔐 Authentication required
- 📊 Statistics display (total tracks, last 24h, unique IPs)
- 📋 Track listing with sorting
- 🗺️ Google Maps links for GPS data
- 📥 Export data as JSON
- 🔄 Real-time refresh

**Authentication**:
- Session-based (sessionStorage)
- Username/password validation
- No tokens (simple demo)

**Statistics Shown**:
```typescript
interface AdminStats {
  totalTracks: number;
  last24Hours: number;
  uniqueIPs: number;
  gpsEnabled: number;
}
```

---

### 8. Dynamic Page Configuration

**File**: `config.json`

**Purpose**: Configure tracking pages without code changes

**Structure**:
```json
{
  "trackingPages": {
    "default": {
      "enabled": true,
      "url": "/photos",
      "theme": "gallery",
      "title": "Family Photo Album 📸",
      "content": { ... }
    }
  }
}
```

**Features**:
- Enable/disable pages
- Customize themes
- Set titles and subtitles
- Configure content types
- Add loading messages

---

### 9. Multi-Theme Support

**Available Themes**:

#### Photo Gallery Theme
- Grid layout
- Image cards
- Captions
- Hover effects

#### Delivery Tracking Theme
- Status updates
- Tracking numbers
- Estimated times
- Confirmation buttons

#### Video/Embed Theme
- Embedded content
- Responsive iframes
- Custom HTML support

#### Custom Content Theme
- Fully customizable
- Raw HTML injection
- Flexible layouts

---

### 10. Real-Time Tracking

**How Location is Captured**:

1. User visits tracking page
2. Cookie consent requested (if enabled)
3. GPS permission prompt appears
4. Location captured (GPS or IP)
5. Data sent to `/api/track` endpoint
6. Stored in database
7. Admin can view immediately

**Data Flow**:
```
Browser → useLocationTracking hook → /api/track → database.ts → tracking-data.json
```

---

## 🔒 Security Features

### 1. Rate Limiting
- Prevents abuse
- IP-based tracking
- Configurable limits
- Automatic cleanup

### 2. Environment Variables
- Sensitive data never in code
- Loaded from `.env.local`
- Different per environment
- Secure in Vercel

### 3. Input Validation
- TypeScript type checking
- Request body validation
- Error handling
- Sanitized outputs

### 4. Authentication
- Admin routes protected
- Session-based auth
- Credentials in env vars
- Login required

---

## 📊 Tracking Capabilities

### Data Points Collected

#### GPS Data (if available)
- Latitude (decimal degrees)
- Longitude (decimal degrees)
- Accuracy (meters)
- Altitude (meters, optional)
- Heading (degrees, optional)
- Speed (m/s, optional)
- Timestamp (ISO 8601)

#### IP Data (always)
- IP address
- City
- Region/State
- Country
- ISP
- Approximate coordinates

#### Device Data
- Unique fingerprint
- Platform (Windows, Mac, Linux, etc.)
- User Agent
- Language
- Screen resolution
- Timezone

#### Page Data
- Page URL
- Referrer
- Timestamp
- Error messages (if any)

---

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly buttons
- Readable on all screens

### Animations
- Fade-in effects
- Smooth transitions
- Loading spinners
- Theme transitions

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

### User Feedback
- Loading states
- Error messages
- Success confirmations
- Progress indicators

---

## 🔄 Real-Time Updates

### Admin Dashboard
- Manual refresh button
- Auto-refresh option (can be added)
- Live statistics
- Instant data export

### Database Updates
- Immediate write to JSON file
- No caching delay
- Synchronous operations
- Data integrity ensured

---

## 🧪 Testing Features

### Manual Testing
1. **Location Accuracy**: Compare GPS vs IP location
2. **Consent Flow**: Test with/without consent
3. **Theme Switching**: Toggle dark/light mode
4. **Rate Limiting**: Make rapid requests
5. **Admin Auth**: Try wrong credentials
6. **Data Export**: Download and verify JSON

### Automated Testing (Future)
```typescript
// Component tests
import { render, screen } from '@testing-library/react';
import PhotosPage from '@/app/photos/page';

test('displays photo gallery', () => {
  render(<PhotosPage />);
  expect(screen.getByText(/Family Photo Album/i)).toBeInTheDocument();
});

// API route tests
import { POST } from '@/app/api/track/route';

test('track endpoint validates data', async () => {
  const response = await POST(mockRequest);
  expect(response.status).toBe(200);
});
```

---

## 📈 Performance Features

### Optimization
- **Server-Side Rendering**: Faster initial loads
- **Code Splitting**: Load only needed code
- **Image Optimization**: Next.js Image component
- **CSS Purging**: Tailwind removes unused styles
- **Caching**: Static assets cached at edge

### Monitoring
- Vercel Analytics integration ready
- Error tracking via logs
- Performance metrics available
- Real-time monitoring

---

## 🌍 Multi-Page Support

The app supports multiple tracking pages simultaneously:

1. `/photos` - Photo gallery theme
2. `/delivery` - Delivery tracking theme
3. `/share` - Shared content theme
4. `/track` - Stealth photo gallery
5. `/view`, `/album`, `/content` - Additional customizable pages

Each page can:
- Have unique theme
- Custom content
- Different tracking behavior
- Separate configuration

---

## 🔌 Integration Ready

### Add External Services

#### Supabase Integration
```typescript
// Already has type definitions
// Just add connection in database.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
```

#### Email Notifications
```typescript
// Add to tracking endpoint
import nodemailer from 'nodemailer';

// Send email when high-accuracy location captured
if (accuracy < 50) {
  await sendEmail({
    to: 'admin@example.com',
    subject: 'High Accuracy Track',
    body: `Location: ${latitude}, ${longitude}`
  });
}
```

#### Webhook Support
```typescript
// Add to tracking endpoint
await fetch('https://your-webhook.com/track', {
  method: 'POST',
  body: JSON.stringify(trackData)
});
```

---

## 📚 API Documentation

### POST /api/track
**Purpose**: Stealth tracking endpoint

**Request**:
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "accuracy": 10,
  "timestamp": "2024-01-01T00:00:00Z",
  "deviceInfo": { ... },
  "pageUrl": "https://app.com/photos"
}
```

**Response**:
```json
{
  "success": true,
  "trackingId": "track_1234567890_abc123",
  "message": "Tracked successfully"
}
```

### POST /api/log-location
**Purpose**: Standard tracking with consent

**Request**: Similar to `/api/track`

**Response**: Includes IP and GPS location data

### GET /api/admin/tracks
**Purpose**: Retrieve all tracks

**Response**:
```json
{
  "success": true,
  "tracks": [ ... ],
  "stats": { ... }
}
```

### GET /api/health
**Purpose**: Health check

**Response**:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 🎯 Use Cases

### 1. Family Photo Sharing
- Share photos with location tracking
- Know who viewed your album
- Track engagement

### 2. Delivery Confirmation
- Confirm package receipt
- Track delivery location
- Verify delivery times

### 3. Link Analytics
- Track link clicks
- Know visitor locations
- Measure campaign reach

### 4. Event Check-In
- Track event attendance
- Verify location
- Monitor participation

### 5. Content Protection
- Track unauthorized sharing
- Detect location of viewers
- Prevent misuse

---

## ⚖️ Legal & Ethical Use

### ✅ Legal Uses
- With explicit user consent
- For legitimate business purposes
- Disclosed in privacy policy
- Compliant with local laws

### ❌ Illegal Uses
- Without user consent
- For stalking or harassment
- Violating privacy laws
- Deceptive purposes

### 📝 Requirements
1. **Consent**: Obtain before tracking
2. **Disclosure**: Explain what data is collected
3. **Purpose**: State why tracking is needed
4. **Storage**: Explain how long data is kept
5. **Deletion**: Provide data deletion option
6. **Security**: Protect collected data

---

## 🚀 Future Enhancement Ideas

### Potential Features
- [ ] Real-time websocket tracking
- [ ] Historical location playback
- [ ] Geofencing alerts
- [ ] Multiple admin users
- [ ] PostgreSQL/MongoDB integration
- [ ] Email notifications
- [ ] Webhook support
- [ ] Mobile app (React Native)
- [ ] Export to CSV
- [ ] Data visualization (maps, charts)
- [ ] Scheduled data cleanup
- [ ] Two-factor authentication
- [ ] API key authentication
- [ ] Rate limiting by user
- [ ] Custom tracking events

---

## 📖 Learning Resources

- **Next.js**: https://nextjs.org/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **React**: https://react.dev
- **Tailwind**: https://tailwindcss.com/docs
- **Geolocation API**: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

---

## 💡 Pro Tips

1. **TypeScript**: Hover over variables to see types
2. **Hot Reload**: Changes appear instantly
3. **DevTools**: Use React DevTools extension
4. **Network Tab**: Debug API calls
5. **Console**: Check for warnings
6. **Build**: Run `npm run build` before deploying
7. **Logs**: Check Vercel logs for production issues

---

**For full documentation, see README.md**

