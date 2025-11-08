import { NextRequest, NextResponse } from 'next/server';
import { readTracks } from '../../lib/database';

export async function GET(request: NextRequest) {
  try {
    const tracks = await readTracks();

    // Calculate analytics
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

    // Time-based stats
    const last24Hours = tracks.filter(t => new Date(t.timestamp).getTime() > oneDayAgo).length;
    const last7Days = tracks.filter(t => new Date(t.timestamp).getTime() > oneWeekAgo).length;
    const last30Days = tracks.filter(t => new Date(t.timestamp).getTime() > oneMonthAgo).length;

    // Location stats
    const gpsEnabled = tracks.filter(t => t.latitude && t.longitude).length;
    const gpsPercentage = tracks.length > 0 ? (gpsEnabled / tracks.length) * 100 : 0;

    // Unique IPs
    const uniqueIPs = new Set(tracks.map(t => t.clientIP)).size;

    // Country distribution
    const countryMap = new Map<string, number>();
    tracks.forEach(track => {
      if (track.ipLocation?.country) {
        const count = countryMap.get(track.ipLocation.country) || 0;
        countryMap.set(track.ipLocation.country, count + 1);
      }
    });

    const topCountries = Array.from(countryMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // City distribution
    const cityMap = new Map<string, number>();
    tracks.forEach(track => {
      if (track.ipLocation?.city) {
        const count = cityMap.get(track.ipLocation.city) || 0;
        cityMap.set(track.ipLocation.city, count + 1);
      }
    });

    const topCities = Array.from(cityMap.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Hourly distribution (last 24 hours)
    const hourlyData = new Array(24).fill(0);
    tracks.forEach(track => {
      const trackTime = new Date(track.timestamp).getTime();
      if (trackTime > oneDayAgo) {
        const hour = new Date(track.timestamp).getHours();
        hourlyData[hour]++;
      }
    });

    // Daily distribution (last 30 days)
    const dailyData = new Array(30).fill(0);
    tracks.forEach(track => {
      const trackTime = new Date(track.timestamp).getTime();
      if (trackTime > oneMonthAgo) {
        const daysAgo = Math.floor((now - trackTime) / (24 * 60 * 60 * 1000));
        if (daysAgo < 30) {
          dailyData[29 - daysAgo]++;
        }
      }
    });

    // Browser/Device stats
    const deviceMap = new Map<string, number>();
    tracks.forEach(track => {
      if (track.userAgent) {
        let device = 'Unknown';
        if (track.userAgent.includes('Mobile')) device = 'Mobile';
        else if (track.userAgent.includes('Tablet')) device = 'Tablet';
        else device = 'Desktop';
        
        const count = deviceMap.get(device) || 0;
        deviceMap.set(device, count + 1);
      }
    });

    const deviceStats = Array.from(deviceMap.entries())
      .map(([device, count]) => ({ device, count }));

    // Accuracy stats (for GPS-enabled tracks)
    const gpsAccuracies = tracks
      .filter(t => t.accuracy)
      .map(t => t.accuracy!);
    
    const avgAccuracy = gpsAccuracies.length > 0
      ? gpsAccuracies.reduce((sum, acc) => sum + acc, 0) / gpsAccuracies.length
      : 0;

    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          totalTracks: tracks.length,
          uniqueIPs,
          gpsEnabled,
          gpsPercentage: Math.round(gpsPercentage * 10) / 10,
          avgAccuracy: Math.round(avgAccuracy)
        },
        timeStats: {
          last24Hours,
          last7Days,
          last30Days
        },
        topCountries,
        topCities,
        deviceStats,
        hourlyData,
        dailyData,
        recentTracks: tracks.slice(-10).reverse()
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate analytics' },
      { status: 500 }
    );
  }
}

