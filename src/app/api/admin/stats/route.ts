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

    // This will be replaced with actual database queries
    const stats = {
      eventsCount: 5,
      galleriesCount: 3,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 

export const dynamic = 'force-dynamic';