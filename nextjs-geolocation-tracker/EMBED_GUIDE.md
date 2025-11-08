# 🎬 Embed Content Guide

## Overview

You can now embed custom content (videos, iframes, HTML) in your tracking pages! This allows you to display YouTube videos, Vimeo content, custom HTML, or any embeddable content while tracking user locations.

---

## 🎯 Features

- ✅ **YouTube/Vimeo Videos** - Embed video content
- ✅ **Custom iframes** - Embed any URL
- ✅ **Custom HTML** - Inject custom HTML content
- ✅ **Responsive Design** - Auto-adjusts to screen size
- ✅ **Loading States** - Beautiful loading animations
- ✅ **Dark Mode** - Full dark mode support
- ✅ **Location Tracking** - Tracks users viewing embedded content

---

## 📦 New Components

### EmbedContent Component
**Location:** `/app/components/EmbedContent.tsx`

**Features:**
- Renders iframe embeds or custom HTML
- 16:9 responsive aspect ratio
- Loading spinner
- Error handling
- Dark mode compatible

---

## 📄 New Pages

### 1. Embed Page (`/embed`)
Dedicated page for embedded content with stealth tracking.

### 2. Updated Share Page (`/share`)
Now supports embedded content with cookie consent.

---

## 🔧 Configuration

### Basic Embed (YouTube Video)

Edit `config.json`:

```json
{
  "trackingPages": {
    "myVideo": {
      "enabled": true,
      "url": "/embed",
      "theme": "embed",
      "title": "Watch Our Video 🎬",
      "subtitle": "Exclusive content",
      "loadingText": "Loading video...",
      "content": {
        "type": "embed",
        "embedUrl": "https://www.youtube.com/embed/VIDEO_ID",
        "message": "Enjoy this video!"
      },
      "embedCode": null
    }
  }
}
```

---

### Embed Types

#### 1. YouTube Video

```json
{
  "content": {
    "type": "embed",
    "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
}
```

#### 2. Vimeo Video

```json
{
  "content": {
    "type": "embed",
    "embedUrl": "https://player.vimeo.com/video/VIDEO_ID"
  }
}
```

#### 3. Google Maps

```json
{
  "content": {
    "type": "embed",
    "embedUrl": "https://www.google.com/maps/embed?pb=..."
  }
}
```

#### 4. Custom HTML

```json
{
  "content": {
    "type": "custom",
    "html": "<div class='custom-content'><h2>Hello World</h2><p>Custom HTML content here</p></div>"
  }
}
```

#### 5. Any iframe

```json
{
  "content": {
    "type": "embed",
    "embedUrl": "https://example.com/embed/content"
  }
}
```

---

## 🎨 Usage Examples

### Example 1: YouTube Video with Message

```json
{
  "embed1": {
    "enabled": true,
    "url": "/video",
    "theme": "video",
    "title": "Tutorial Video 📹",
    "subtitle": "Learn how to use our service",
    "loadingText": "Loading tutorial...",
    "content": {
      "type": "embed",
      "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "message": "Watch this tutorial to get started!"
    },
    "embedCode": null
  }
}
```

**Result:** 
- URL: `/video`
- Shows YouTube video
- Displays message below video
- Tracks user location

---

### Example 2: Custom HTML Content

```json
{
  "custom1": {
    "enabled": true,
    "url": "/promo",
    "theme": "custom",
    "title": "Special Offer 🎁",
    "subtitle": "Limited time only",
    "loadingText": "Loading offer...",
    "content": {
      "type": "custom",
      "html": "<div style='text-align: center; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 12px;'><h2 style='font-size: 32px; margin-bottom: 20px;'>🎉 50% OFF!</h2><p style='font-size: 18px;'>Use code: SAVE50</p><button style='margin-top: 20px; padding: 12px 24px; background: white; color: #667eea; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;'>Claim Offer</button></div>"
    },
    "embedCode": null
  }
}
```

**Result:**
- URL: `/promo`
- Shows custom styled HTML
- Tracks user location

---

### Example 3: Google Maps Embed

```json
{
  "location": {
    "enabled": true,
    "url": "/location",
    "theme": "map",
    "title": "Find Us 📍",
    "subtitle": "Visit our location",
    "loadingText": "Loading map...",
    "content": {
      "type": "embed",
      "embedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2412648750455!2d-73.98784368459395!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus",
      "message": "Visit us at this location!"
    },
    "embedCode": null
  }
}
```

---

## 🚀 How to Use

### Step 1: Create Configuration

Edit `nextjs-geolocation-tracker/config.json` and add your embed page:

```json
{
  "trackingPages": {
    "myEmbed": {
      "enabled": true,
      "url": "/my-content",
      "theme": "embed",
      "title": "My Content",
      "subtitle": "Description",
      "loadingText": "Loading...",
      "content": {
        "type": "embed",
        "embedUrl": "YOUR_EMBED_URL_HERE"
      },
      "embedCode": null
    }
  }
}
```

### Step 2: Access Your Page

Visit: `http://localhost:3000/my-content`

Or use existing pages:
- `/embed` - Stealth tracking embed page
- `/share` - Embed with cookie consent

---

## 📝 Configuration Options

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `enabled` | boolean | Enable/disable the page | Yes |
| `url` | string | URL path (e.g., "/video") | Yes |
| `theme` | string | Theme name | Yes |
| `title` | string | Page title | Yes |
| `subtitle` | string | Page subtitle | Yes |
| `loadingText` | string | Loading message | Yes |
| `content.type` | string | "embed" or "custom" | Yes |
| `content.embedUrl` | string | URL to embed | For type="embed" |
| `content.html` | string | Custom HTML | For type="custom" |
| `content.message` | string | Optional message below content | No |

---

## 🎨 Supported Embed Sources

### Video Platforms
- ✅ YouTube (`youtube.com/embed/VIDEO_ID`)
- ✅ Vimeo (`player.vimeo.com/video/VIDEO_ID`)
- ✅ Dailymotion
- ✅ Twitch
- ✅ Facebook Video

### Maps
- ✅ Google Maps
- ✅ OpenStreetMap
- ✅ Mapbox

### Documents
- ✅ Google Docs
- ✅ Google Sheets
- ✅ PDF viewers

### Social Media
- ✅ Twitter/X embeds
- ✅ Instagram embeds
- ✅ TikTok embeds

### Custom
- ✅ Any iframe-compatible URL
- ✅ Custom HTML/CSS/JS

---

## 🔒 Security Considerations

### Safe Practices:
- ✅ Only embed from trusted sources
- ✅ Use HTTPS URLs
- ✅ Sanitize custom HTML
- ✅ Test embeds before deploying

### Avoid:
- ❌ Untrusted third-party content
- ❌ HTTP (non-secure) URLs
- ❌ Malicious scripts
- ❌ Privacy-violating embeds

---

## 💡 Advanced Examples

### Example: Multiple Embeds with Tabs

Create multiple pages in config:

```json
{
  "video1": {
    "enabled": true,
    "url": "/video1",
    "content": {
      "type": "embed",
      "embedUrl": "https://www.youtube.com/embed/VIDEO1"
    }
  },
  "video2": {
    "enabled": true,
    "url": "/video2",
    "content": {
      "type": "embed",
      "embedUrl": "https://www.youtube.com/embed/VIDEO2"
    }
  }
}
```

---

### Example: HTML with Styling

```json
{
  "content": {
    "type": "custom",
    "html": "<style>.promo { background: #f59e0b; padding: 40px; border-radius: 12px; text-align: center; } .promo h2 { color: white; font-size: 36px; margin-bottom: 20px; } .promo button { background: white; color: #f59e0b; padding: 15px 30px; border: none; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer; }</style><div class='promo'><h2>🎉 Special Offer!</h2><p style='color: white; font-size: 20px; margin-bottom: 30px;'>Get 50% off today only!</p><button onclick='alert(\"Offer claimed!\")'>Claim Now</button></div>"
  }
}
```

---

## 🧪 Testing

### Test Locally

1. **Start dev server:**
   ```bash
   cd nextjs-geolocation-tracker
   npm run dev
   ```

2. **Visit embed pages:**
   - `/embed` - Stealth tracking
   - `/share` - With cookie consent

3. **Test features:**
   - Video loads correctly
   - Tracking works
   - Responsive on mobile
   - Dark mode works

---

## 📱 Responsive Design

The EmbedContent component is fully responsive:
- **Desktop:** Full-width embed
- **Tablet:** Optimized layout
- **Mobile:** Touch-friendly, full-width

Aspect ratio: 16:9 (standard video format)

---

## 🌙 Dark Mode

Embeds work perfectly in dark mode:
- Loading spinner adapts
- Background colors adjust
- Text remains readable

---

## 🎯 Use Cases

### 1. Video Sharing
Share videos while tracking who watches them.

### 2. Product Demos
Embed product demo videos with location tracking.

### 3. Promotional Content
Display promotional content and track engagement.

### 4. Event Invitations
Embed event details with RSVP tracking.

### 5. Location Sharing
Show Google Maps with your location.

### 6. Document Sharing
Embed PDFs or Google Docs.

---

## 🔧 Customization

### Change Aspect Ratio

Edit `EmbedContent.tsx`:

```typescript
// Change from 16:9 to 4:3
style={{ paddingBottom: '75%' }}  // Instead of 56.25%

// Change to square
style={{ paddingBottom: '100%' }}
```

### Add Custom Styling

In your custom HTML:

```html
<style>
  .my-custom-class {
    /* Your styles */
  }
</style>
<div class="my-custom-class">
  <!-- Your content -->
</div>
```

---

## 📊 Tracking

All embed pages automatically track:
- ✅ User location (GPS/IP)
- ✅ Page views
- ✅ Device information
- ✅ Timestamp
- ✅ Referrer

View tracking data in:
- `/admin` - Dashboard
- `/analytics` - Detailed analytics

---

## 🚀 Deployment

Embed feature works on Vercel without additional configuration:

1. Push changes to GitHub
2. Vercel auto-deploys
3. Test your embed URLs
4. Share with users!

---

## 🐛 Troubleshooting

### Embed not loading?
- Check if URL is embeddable (some sites block iframes)
- Verify HTTPS is used
- Check browser console for errors

### Video not playing?
- Some platforms require specific embed URLs
- Check if content is region-restricted
- Verify embed permissions

### Custom HTML not rendering?
- Check for JavaScript errors
- Verify HTML syntax
- Test in browser console first

---

## 📚 API Reference

### EmbedContent Props

```typescript
interface EmbedContentProps {
  embedUrl?: string;           // URL to embed
  html?: string;               // Custom HTML
  title?: string;              // Title for iframe
  allowFullscreen?: boolean;   // Allow fullscreen (default: true)
}
```

### Usage in Components

```tsx
import EmbedContent from '../components/EmbedContent';

<EmbedContent
  embedUrl="https://www.youtube.com/embed/VIDEO_ID"
  title="My Video"
  allowFullscreen={true}
/>
```

---

## 🎉 Examples

### YouTube Video

**Config:**
```json
{
  "content": {
    "type": "embed",
    "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
}
```

**URL:** `/embed`

---

### Vimeo Video

**Config:**
```json
{
  "content": {
    "type": "embed",
    "embedUrl": "https://player.vimeo.com/video/76979871"
  }
}
```

---

### Google Maps

**Config:**
```json
{
  "content": {
    "type": "embed",
    "embedUrl": "https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE"
  }
}
```

**How to get Google Maps embed code:**
1. Go to Google Maps
2. Search for location
3. Click "Share" → "Embed a map"
4. Copy the iframe src URL

---

### Custom Promo Banner

**Config:**
```json
{
  "content": {
    "type": "custom",
    "html": "<div style='background: #f59e0b; padding: 60px; text-align: center; border-radius: 12px;'><h1 style='color: white; font-size: 48px; margin-bottom: 20px;'>🎉 SALE!</h1><p style='color: white; font-size: 24px;'>50% OFF Everything</p></div>"
  }
}
```

---

## 📈 Analytics

Track embed performance in `/analytics`:
- View counts
- Geographic distribution
- Device types
- Time-based analytics

---

## 🔐 Privacy & Consent

### Stealth Mode (`/embed`)
- No cookie banner
- Automatic tracking
- Immediate content display

### Consent Mode (`/share`)
- Shows cookie banner
- Requires consent
- Tracks after acceptance

---

## 🎓 Best Practices

### 1. Use Appropriate Tracking Mode
- **Stealth** - For internal use
- **Consent** - For public/GDPR compliance

### 2. Test Embeds First
- Verify content loads
- Check mobile responsiveness
- Test in different browsers

### 3. Optimize Loading
- Use fast embed sources
- Minimize custom HTML
- Test loading times

### 4. Monitor Analytics
- Check view counts
- Review geographic data
- Optimize based on insights

---

## 🌐 Supported URLs

### ✅ Works Well:
- YouTube embeds
- Vimeo embeds
- Google Maps
- Most video platforms
- Document viewers

### ⚠️ May Not Work:
- Sites with X-Frame-Options: DENY
- Sites blocking iframes
- Non-embeddable content
- Region-restricted content

---

## 🔄 Dynamic Updates

Update embed content without redeploying:

1. Edit `config.json`
2. Save file
3. Refresh page
4. New content loads!

**Note:** On Vercel, you'll need to redeploy or use a database for dynamic updates.

---

## 📦 Files Created

1. **`/app/components/EmbedContent.tsx`** - Embed component
2. **`/app/embed/page.tsx`** - Embed page (stealth)
3. **Updated `/app/share/page.tsx`** - Now supports embeds
4. **Updated `config.json`** - Added embed examples

---

## ✅ Checklist

Before using embeds:

- [ ] Configure `config.json` with your embed
- [ ] Test locally (`npm run dev`)
- [ ] Verify content loads
- [ ] Check mobile responsiveness
- [ ] Test tracking works
- [ ] Deploy to Vercel
- [ ] Test production URL
- [ ] Monitor analytics

---

## 🎉 You're Ready!

You can now embed any content in your tracking pages!

**Quick Start:**
1. Edit `config.json`
2. Add your `embedUrl` or `html`
3. Visit your page
4. Content displays with tracking!

---

**Questions?** Check the main documentation or create an issue on GitHub.

**Version:** 2.1.0  
**Date:** November 8, 2024  
**Status:** ✅ Production Ready

