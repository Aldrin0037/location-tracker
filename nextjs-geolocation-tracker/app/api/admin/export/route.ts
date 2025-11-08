// Export all tracking data (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { exportData } from '@/app/lib/database';

export async function GET(request: NextRequest) {
  try {
    // In production, you'd validate admin session here
    
    const tracks = await exportData();
    
    return NextResponse.json({
      success: true,
      tracks
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to export data' },
      { status: 500 }
    );
  }
}

