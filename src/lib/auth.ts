import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function getAdminSecret() {
  try {
    return await prisma.adminSecret.findFirst();
  } catch (error) {
    console.error('Error fetching admin secret:', error);
    return null;
  }
}

export async function verifyAdminPassword(password: string) {
  try {
    const adminSecret = await getAdminSecret();
    
    if (!adminSecret) {
      return false;
    }
    
    return bcrypt.compare(password, adminSecret.secret);
  } catch (error) {
    console.error('Error verifying admin password:', error);
    return false;
  }
}

export async function verifyAdminCookie() {
  try {
    const cookieStore = cookies();
    const adminAuthCookie = cookieStore.get('admin_auth');
    
    if (!adminAuthCookie?.value) {
      return false;
    }
    
    const adminSecret = await getAdminSecret();
    
    if (!adminSecret) {
      return false;
    }
    
    return adminAuthCookie.value === adminSecret.secret;
  } catch (error) {
    console.error('Error verifying admin cookie:', error);
    return false;
  }
}

export async function createHashedPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function updateAdminPassword(currentPassword: string, newPassword: string): Promise<{
  success: boolean;
  error?: string;
  hashedPassword?: string;
}> {
  try {
    const adminSecret = await getAdminSecret();
    
    if (!adminSecret) {
      return { success: false, error: 'Admin secret not found' };
    }
    
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword, 
      adminSecret.secret
    );
    
    if (!isCurrentPasswordValid) {
      return { success: false, error: 'Поточний пароль введено неправильно' };
    }
    
    const hashedNewPassword = await createHashedPassword(newPassword);
    
    await prisma.adminSecret.update({
      where: { id: adminSecret.id },
      data: { secret: hashedNewPassword }
    });
    
    return { success: true, hashedPassword: hashedNewPassword };
  } catch (error) {
    console.error('Error updating admin password:', error);
    return { success: false, error: 'Server error' };
  }
} 