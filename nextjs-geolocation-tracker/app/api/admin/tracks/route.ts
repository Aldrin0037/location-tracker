// Get all tracks (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { getRecentTracks, getStats, clearAllTracks } from '@/app/lib/database';

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

// Delete all tracks (admin only)
export async function DELETE(request: NextRequest) {
  try {
    // In production, you'd validate admin session here
    const result = await clearAllTracks();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'All tracking data cleared successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.error || 'Failed to clear data' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to clear data' },
      { status: 500 }
    );
  }
}

