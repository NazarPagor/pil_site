import { NextResponse } from 'next/server';
//import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { secretPhrase } = await request.json();
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret) {
      console.error('ADMIN_SECRET is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (secretPhrase === adminSecret) {
      // Set a secure HTTP-only cookie
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_auth', 'true', {
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
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 