import { NextRequest, NextResponse } from 'next/server';
import { readTracks } from '../../lib/database';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const since = searchParams.get('since'); // timestamp

    // Read all tracks
    let tracks = await readTracks();

    // Filter by timestamp if provided
    if (since) {
      const sinceTime = new Date(since).getTime();
      tracks = tracks.filter(track => {
        const trackTime = new Date(track.timestamp).getTime();
        return trackTime > sinceTime;
      });
    }

    // Sort by timestamp (newest first)
    tracks.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    // Limit results
    const limitedTracks = tracks.slice(0, limit);

    // Calculate quick stats
    const stats = {
      total: tracks.length,
      gpsEnabled: tracks.filter(t => t.latitude && t.longitude).length,
      uniqueIPs: new Set(tracks.map(t => t.clientIP)).size,
      lastUpdate: tracks.length > 0 ? tracks[0].timestamp : null
    };

    return NextResponse.json({
      success: true,
      tracks: limitedTracks,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Real-time tracking error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch real-time data' },
      { status: 500 }
    );
  }
}

// WebSocket-style long polling endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lastTimestamp } = body;

    // Wait for new data (simple polling implementation)
    // In production, consider using WebSockets or Server-Sent Events
    const maxWaitTime = 30000; // 30 seconds
    const pollInterval = 1000; // 1 second
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const tracks = await readTracks();
      
      // Check if there are new tracks since lastTimestamp
      const newTracks = tracks.filter(track => {
        if (!lastTimestamp) return true;
        return new Date(track.timestamp).getTime() > new Date(lastTimestamp).getTime();
      });

      if (newTracks.length > 0) {
        return NextResponse.json({
          success: true,
          tracks: newTracks,
          hasNewData: true,
          timestamp: new Date().toISOString()
        });
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    // Timeout - no new data
    return NextResponse.json({
      success: true,
      tracks: [],
      hasNewData: false,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Long polling error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to poll for updates' },
      { status: 500 }
    );
  }
}

