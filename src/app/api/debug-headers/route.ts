import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const isVercelPreview = hostname.includes('.vercel.');
  
  // This API is only available in non-production environments
  if (process.env.NODE_ENV === 'production' && !isVercelPreview) {
    return NextResponse.json(
      { error: 'This API is not available in production' },
      { status: 403 }
    );
  }
  
  return NextResponse.json({
    hostname,
    isVercelPreview,
    vercelEnv: process.env.VERCEL_ENV || 'not set',
    nodeEnv: process.env.NODE_ENV || 'not set',
    robotsHeader: request.headers.get('x-robots-tag') || 'not set',
    headers: Object.fromEntries(request.headers.entries()),
  });
} 