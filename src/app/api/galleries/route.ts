import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const galleries = await prisma.gallery.findMany({
      include: {
        images: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(galleries);
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return NextResponse.json({ error: 'Failed to fetch galleries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { images, ...galleryData } = body;
    
    const gallery = await prisma.gallery.create({
      data: {
        ...galleryData,
        images: {
          create: images
        }
      },
      include: {
        images: true
      }
    });
    
    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Error creating gallery:', error);
    return NextResponse.json({ error: 'Failed to create gallery' }, { status: 500 });
  }
} 