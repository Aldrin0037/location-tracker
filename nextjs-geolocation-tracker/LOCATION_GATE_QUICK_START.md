# Location Gate - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Basic Implementation

```tsx
import { useState } from 'react';
import LocationGate from '../components/LocationGate';

export default function MyPage() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <>
      {!unlocked ? (
        <LocationGate onUnlock={() => setUnlocked(true)} />
      ) : (
        <div>Your protected content here</div>
      )}
    </>
  );
}
```

## 📋 Component Props

### LocationGate (Standard)

```tsx
<LocationGate
  onUnlock={() => setUnlocked(true)}              // Required: callback when unlocked
  title="🔒 Private Content"                      // Optional: custom title
  description="Share location to unlock..."       // Optional: custom description
  pageUrl={window.location.href}                  // Optional: URL to track
/>
```

### LocationGateEnhanced (Advanced)

```tsx
<LocationGateEnhanced
  onUnlock={() => setUnlocked(true)}
  title="💎 Exclusive Content"
  description="Premium content awaits..."
  benefits={[                                      // Optional: custom benefits list
    "Access exclusive features",
    "Personalized experience",
    "Enhanced security"
  ]}
  theme="exclusive"                                // Optional: default|security|exclusive|delivery
  pageUrl={window.location.href}
/>
```

## 🎨 Available Themes (Enhanced Version)

| Theme | Icon | Use Case |
|-------|------|----------|
| `default` | 🔒 | General content protection |
| `security` | 🛡️ | Security-focused content |
| `exclusive` | 💎 | Premium/VIP content |
| `delivery` | 📦 | Package/delivery tracking |

## 💡 Use Cases

### 1. Private Photo Gallery
```tsx
<LocationGate
  title="🔒 Private Photo Album"
  description="This family photo album is location-protected."
/>
```

### 2. Delivery Tracking
```tsx
<LocationGateEnhanced
  title="📦 Package Tracking"
  description="Verify your location to view delivery details."
  theme="delivery"
/>
```

### 3. Exclusive Content
```tsx
<LocationGateEnhanced
  title="💎 VIP Access"
  description="Premium members only. Verify location to continue."
  theme="exclusive"
  benefits={[
    "Access premium content",
    "Exclusive member features",
    "Priority support"
  ]}
/>
```

### 4. Event Check-in
```tsx
<LocationGate
  title="🎫 Event Access"
  description="Verify you're at the venue to access event content."
/>
```

## 🔧 Customization Examples

### Custom Colors
Edit the component to change colors:
```tsx
// Change from amber to blue
className="bg-amber-500" → className="bg-blue-500"
```

### Custom Animation Speed
```tsx
// In LocationGate.tsx, adjust timeout:
setTimeout(() => onUnlock(), 1500); // Change 1500 to your preferred ms
```

### Custom Progress Messages
```tsx
// In LocationGate.tsx, modify progress messages:
{progress < 30 && "Your custom message..."}
```

## 📊 Tracking Success

The LocationGate automatically:
- ✅ Captures GPS coordinates
- ✅ Sends data to `/api/track`
- ✅ Records device fingerprint
- ✅ Logs timestamp and referrer

Access tracking data via:
- Admin dashboard: `/admin`
- Analytics page: `/analytics`
- API endpoint: `/api/analytics`

## 🎯 Best Practices

### DO ✅
- Explain WHY location is needed
- Show preview of locked content
- Provide clear error messages
- Make content worth the permission
- Test on mobile devices

### DON'T ❌
- Use vague language ("we need your location")
- Hide the location requirement
- Lock trivial content
- Ignore error states
- Forget mobile optimization

## 🔒 Privacy Tips

1. **Be Transparent**: Clearly state why location is needed
2. **Minimize Data**: Only collect what's necessary
3. **Secure Storage**: Ensure API endpoints are protected
4. **User Control**: Allow users to revoke access
5. **Clear Policy**: Link to privacy policy

## 📱 Mobile Considerations

### iOS Safari
- Requires HTTPS in production
- May show additional system prompt
- Location accuracy varies

### Android Chrome
- Generally more permissive
- Better GPS accuracy
- Faster permission flow

### Testing
```bash
# Test on mobile devices:
1. Deploy to HTTPS server (required for geolocation)
2. Access from mobile browser
3. Grant location permission
4. Verify tracking data in admin panel
```

## 🐛 Troubleshooting

### Permission Denied
**Symptom**: User clicks unlock but gets error
**Solution**: Show browser instructions (already built-in)

### Slow Loading
**Symptom**: Takes too long to unlock
**Solution**: Check API response time, reduce animation delays

### Not Working on HTTP
**Symptom**: Location request fails on localhost
**Solution**: Use HTTPS or test on deployed site

### Content Shows Without Location
**Symptom**: Content visible before unlock
**Solution**: Ensure `contentUnlocked` state starts as `false`

## 🚀 Advanced Features

### Persistent Unlock
```tsx
// Save unlock state to localStorage
const [unlocked, setUnlocked] = useState(() => {
  return localStorage.getItem('content_unlocked') === 'true';
});

const handleUnlock = () => {
  setUnlocked(true);
  localStorage.setItem('content_unlocked', 'true');
};
```

### Time-Limited Access
```tsx
const handleUnlock = () => {
  setUnlocked(true);
  // Auto-lock after 1 hour
  setTimeout(() => setUnlocked(false), 3600000);
};
```

### Geofencing
```tsx
// In LocationGate component, add validation:
const validateLocation = (lat: number, lng: number) => {
  const targetLat = 40.7128;  // NYC
  const targetLng = -74.0060;
  const distance = calculateDistance(lat, lng, targetLat, targetLng);
  return distance < 10; // Within 10km
};
```

## 📚 Related Files

- Component: `app/components/LocationGate.tsx`
- Enhanced: `app/components/LocationGateEnhanced.tsx`
- Hook: `app/hooks/useLocationTracking.ts`
- Styles: `app/globals.css`
- Guide: `LOCATION_GATE_GUIDE.md`

## 🎓 Examples in Codebase

Live examples:
- `/track` - Photo album
- `/photos` - Dynamic photos
- `/share` - Shared content
- `/delivery` - Package tracking

## 💬 Support

For questions or issues:
1. Check `LOCATION_GATE_GUIDE.md` for detailed info
2. Review example pages in `/track`, `/photos`, etc.
3. Test with browser dev tools (Network tab, Console)

---

**Ready to implement?** Copy the basic example above and customize for your use case! 🎉

