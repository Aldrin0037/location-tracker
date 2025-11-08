// Admin configuration management
import { NextRequest, NextResponse } from 'next/server';
import { loadConfig, saveConfig } from '@/app/lib/utils-server';

// GET configuration
export async function GET(request: NextRequest) {
  try {
    const config = await loadConfig();
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to load config' },
      { status: 500 }
    );
  }
}

// POST (update) configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { config } = body;
    
    const saved = await saveConfig(config);
    
    if (saved) {
      return NextResponse.json({ success: true, message: 'Configuration updated' });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to save' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save config' },
      { status: 500 }
    );
  }
}

