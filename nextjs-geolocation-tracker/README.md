# Geolocation Tracker - Next.js Version

A modern, TypeScript-based geolocation tracking application built with Next.js 13+ App Router.

## Features

- 🗺️ **GPS Location Tracking**: Capture precise GPS coordinates with user consent
- 🌐 **IP Geolocation**: Fallback to IP-based location tracking
- 🎭 **Stealth Mode**: Track without explicit consent banners
- 📊 **Admin Dashboard**: View all tracked locations and statistics
- 🎨 **Dark Mode**: Built-in theme toggle with localStorage persistence
- ⚡ **Rate Limiting**: Protect against abuse with middleware-based rate limiting
- 🔒 **Type Safety**: Full TypeScript support throughout
- 🚀 **Vercel Ready**: Optimized for serverless deployment

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: JSON file storage (easily replaceable with PostgreSQL/MongoDB)
- **Geolocation API**: ip-api.com for IP-based location
- **Deployment**: Vercel

## Project Structure

```
/app
  /api                    # API routes (serverless functions)
    /track               # Location tracking endpoint
    /log-location        # Standard tracking with consent
    /admin              # Admin endpoints
    /page-config        # Dynamic page configuration
  /components            # React components
  /hooks                 # Custom React hooks
  /lib                   # Utilities and database
  /types                 # TypeScript type definitions
  /photos               # Dynamic tracking page
  /track                # Stealth tracking page
  /admin                # Admin dashboard
  page.tsx              # Homepage (redirects to /photos)
  globals.css           # Global styles
/public                  # Static assets
config.json             # Page configurations
tracking-data.json      # Tracking data storage
```

## Getting Started

### Prerequisites

- Node.js 14+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nextjs-geolocation-tracker.git
cd nextjs-geolocation-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
NODE_ENV=development
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Tracking Pages

- **Homepage** (`/`): Redirects to `/photos`
- **Photos Page** (`/photos`): Dynamic tracking page with cookie consent
- **Track Page** (`/track`): Stealth tracking without consent banner
- **Admin Dashboard** (`/admin`): View tracked locations and statistics

### API Endpoints

- `POST /api/track`: Stealth tracking endpoint
- `POST /api/log-location`: Standard location logging
- `POST /api/admin/login`: Admin authentication
- `GET /api/admin/tracks`: Retrieve all tracks
- `GET /api/admin/export`: Export tracking data as JSON
- `GET /api/admin/config`: Get configuration
- `POST /api/admin/config`: Update configuration
- `GET /api/page-config/[path]`: Get page configuration
- `GET /api/health`: Health check

## Configuration

Edit `config.json` to customize tracking pages:

```json
{
  "trackingPages": {
    "default": {
      "enabled": true,
      "url": "/photos",
      "theme": "gallery",
      "title": "Family Photo Album 📸",
      "subtitle": "Memories from 2024",
      "loadingText": "Loading your photos...",
      "content": {
        "type": "photos",
        "items": [...]
      }
    }
  }
}
```

## Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/nextjs-geolocation-tracker)

### Manual Deployment

1. Push your code to GitHub

2. Import your repository in Vercel:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your repository
   - Framework: Next.js (auto-detected)

3. Configure environment variables:
   ```
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_secure_password
   ```

4. Deploy!

## Security Considerations

⚠️ **IMPORTANT**: This application tracks user locations. You **MUST**:

- ✅ Obtain explicit consent before tracking
- ✅ Display clear privacy policies
- ✅ Comply with GDPR, CCPA, and local laws
- ✅ Use strong admin credentials in production
- ✅ Never use default credentials (`admin`/`admin123`)
- ❌ Never track users without permission

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New Features

1. **New Page**: Create a new folder in `/app` with `page.tsx`
2. **New API Route**: Add a `route.ts` file in `/app/api/[route-name]/`
3. **New Component**: Create in `/app/components/`
4. **New Hook**: Create in `/app/hooks/`

## Migration from Express

This is a complete rewrite of the Express.js version with:
- ✅ Full TypeScript support
- ✅ Next.js App Router (React Server Components)
- ✅ Improved performance and SEO
- ✅ Simplified deployment to Vercel
- ✅ Better developer experience

## License

MIT

## Legal Disclaimer

This application is for **educational purposes only**. Unauthorized tracking of user locations is illegal and unethical in most jurisdictions. Always obtain explicit informed consent and comply with all applicable privacy laws.

## Support

For issues or questions, please open an issue on GitHub or contact the maintainers.

---

**Remember**: With great power comes great responsibility. Use location tracking ethically and legally.

