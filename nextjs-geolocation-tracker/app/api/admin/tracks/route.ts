// Get all tracks (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { getRecentTracks, getStats } from '@/app/lib/database';

export async function GET(request: NextRequest) {
  try {
    // In production, you'd validate admin session here
    // For now, we'll just return the data
    
    const tracks = await getRecentTracks(100);
    const stats = await getStats();
    
    return NextResponse.json({
      success: true,
      tracks,
      stats
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch tracks' },
      { status: 500 }
    );
  }
}

