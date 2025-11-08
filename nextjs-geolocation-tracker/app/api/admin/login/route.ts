// Admin login endpoint
import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials } from '@/app/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    if (validateAdminCredentials(username, password)) {
      console.log('✅ Admin login successful');
      return NextResponse.json({ success: true });
    } else {
      console.log('❌ Admin login failed:', username);
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

