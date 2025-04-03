import { usePathname } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
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
    const adminAuthCookie = request.cookies.get('admin_auth');
    
    // If no cookie is present, redirect to login
    if (!adminAuthCookie?.value) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // Note: Since we can't access the database in Edge middleware,
    // we rely on the check-auth API call in the Admin layout component
    // to verify that the hash in the cookie matches the one in the database.
    // This middleware only ensures the cookie is present.
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