import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const gallery = await prisma.gallery.findUnique({
      where: { id: params.id },
      include: {
        images: true
      }
    });
    
    if (!gallery) {
      return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
    }
    
    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
} 