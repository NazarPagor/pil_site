import { NextResponse } from 'next/server';
import { verifyAdminCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const isAuthenticated = await verifyAdminCookie();

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Fetch real counts from database
    const eventsCount = await prisma.event.count();
    const galleriesCount = await prisma.gallery.count();

    const stats = {
      eventsCount,
      galleriesCount,
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