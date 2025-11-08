// Dynamic page configuration endpoint
import { NextRequest, NextResponse } from 'next/server';
import { loadConfig } from '@/app/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const pagePath = '/' + params.path.join('/');
    
    const config = await loadConfig();
    
    if (!config || !config.trackingPages) {
      return NextResponse.json({ 
        success: false, 
        error: 'Configuration not loaded' 
      });
    }
    
    // Find matching page configuration
    const page = Object.values(config.trackingPages).find(p => p.url === pagePath);
    
    if (!page || !page.enabled) {
      return NextResponse.json({ 
        success: false, 
        error: 'Page not found or disabled' 
      });
    }
    
    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to load page config' },
      { status: 500 }
    );
  }
}

