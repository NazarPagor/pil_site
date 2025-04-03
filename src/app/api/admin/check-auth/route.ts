import { NextResponse } from 'next/server';
import { verifyAdminCookie } from '@/lib/auth';

export async function GET() {
  try {
    const isAuthenticated = await verifyAdminCookie();

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 

export const dynamic = 'force-dynamic';