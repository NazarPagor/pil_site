import { NextResponse } from 'next/server';
import { updateAdminPassword, verifyAdminCookie } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    // Check if the user is authenticated
    const isAuthenticated = await verifyAdminCookie();
    
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the current and new passwords from the request
    const { currentPassword, newPassword } = await request.json();
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    // Update the password
    const result = await updateAdminPassword(currentPassword, newPassword);
    
    if (!result.success || !result.hashedPassword) {
      return NextResponse.json(
        { error: result.error || 'Failed to update password' },
        { status: 400 }
      );
    }

    // Update the cookie with the new hashed password
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_auth', result.hashedPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Update password error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
} 