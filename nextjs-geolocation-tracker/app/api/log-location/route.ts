// Standard location logging endpoint (with consent)
import { NextRequest, NextResponse } from 'next/server';
import { addTrack } from '@/app/lib/database';
import { getClientIP, checkRateLimit } from '@/app/lib/utils';
import { TrackData, IPLocation } from '@/app/types';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    
    // Rate limiting
    if (!checkRateLimit(clientIP, 10, 5 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests, please try again later.' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { latitude, longitude, accuracy, timestamp } = body;
    
    console.log('\n========== LOCATION LOG ==========');
    console.log('Timestamp:', new Date(timestamp).toISOString());
    console.log('Client IP:', clientIP);
    
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
        
        console.log('\n--- IP-Based Location (Approximate) ---');
        console.log('IP Address:', ipLocation.ip);
        console.log('Location:', `${ipLocation.city}, ${ipLocation.region}, ${ipLocation.country}`);
        console.log('Coordinates:', `${ipLocation.latitude}, ${ipLocation.longitude}`);
        console.log('ISP:', ipLocation.isp);
      }
    } catch (ipError) {
      console.error('IP Geolocation API Error:', ipError);
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
    const trackData: TrackData = {
      clientIP,
      ipLocation,
      latitude,
      longitude,
      accuracy,
      timestamp
    };
    
    await addTrack(trackData);
    
    return NextResponse.json({
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
    
  } catch (error: any) {
    console.error('Error logging location:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to log location',
        error: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

