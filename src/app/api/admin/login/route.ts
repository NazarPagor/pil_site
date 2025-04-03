import { NextResponse } from 'next/server';
import { verifyAdminPassword, getAdminSecret } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { secretPhrase } = await request.json();
    
    if (!secretPhrase) {
      return NextResponse.json(
        { error: 'Secret phrase is required' },
        { status: 400 }
      );
    }

    // Verify the provided secret phrase
    const isValid = await verifyAdminPassword(secretPhrase);

    if (isValid) {
      // Get admin secret to set in cookie
      const adminSecret = await getAdminSecret();
      
      if (!adminSecret) {
        return NextResponse.json(
          { error: 'Server configuration error' },
          { status: 500 }
        );
      }
      
      // Set cookie with the hashed admin secret
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_auth', adminSecret.secret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
      });

    

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid secret phrase' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 