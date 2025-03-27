import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the hostname from the request
  const hostname = request.headers.get('host') || '';
  
  // Check if it's a Vercel preview deployment
  const isVercelPreview = hostname.includes('.vercel.');
  
  // Check if it's a preview environment
  const isPreview = 
    isVercelPreview || 
    process.env.VERCEL_ENV === 'preview' || 
    process.env.NEXT_PUBLIC_IS_PREVIEW === 'true';

  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip middleware for login page and API routes
    if (
      request.nextUrl.pathname === '/admin/login' ||
      request.nextUrl.pathname.startsWith('/api/admin')
    ) {
      return NextResponse.next();
    }

    // Check for admin authentication cookie
    const isAuthenticated = request.cookies.get('admin_auth')?.value === 'true';

    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Get the response
  const response = NextResponse.next();

  // Set X-Robots-Tag header to prevent indexing in preview environments
  if (isPreview || isVercelPreview || process.env.NODE_ENV !== 'production') {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  // Set environment header
  response.headers.set('X-Environment', isVercelPreview ? 'vercel-preview' : (process.env.VERCEL_ENV || 'development'));
  
  // Set a special header for Vercel preview
  if (isVercelPreview) {
    response.headers.set('X-Vercel-Preview', 'true');
  }

  return response;
}

// Match all request paths except for static assets
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/admin/:path*',
  ],
}; 