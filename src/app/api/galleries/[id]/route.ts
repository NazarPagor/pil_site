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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { images, ...galleryData } = body;
    
    // Перевіряємо, чи галерея існує
    const existingGallery = await prisma.gallery.findUnique({
      where: { id: params.id },
      include: { images: true }
    });
    
    if (!existingGallery) {
      return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
    }
    
    // Оновлюємо галерею з транзакцією
    const updatedGallery = await prisma.$transaction(async (tx) => {
      // Видаляємо усі існуючі зображення
      await tx.image.deleteMany({
        where: { galleryId: params.id }
      });
      
      // Оновлюємо основні дані галереї
      const gallery = await tx.gallery.update({
        where: { id: params.id },
        data: {
          ...galleryData,
          images: {
            create: images.map((image: any) => ({
              url: image.url,
              alt: image.alt
            }))
          }
        },
        include: {
          images: true
        }
      });
      
      return gallery;
    });
    
    return NextResponse.json(updatedGallery);
  } catch (error) {
    console.error('Error updating gallery:', error);
    return NextResponse.json({ error: 'Failed to update gallery' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Перевіряємо, чи галерея існує
    const existingGallery = await prisma.gallery.findUnique({
      where: { id: params.id }
    });
    
    if (!existingGallery) {
      return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
    }
    
    // Видаляємо галерею з транзакцією
    await prisma.$transaction(async (tx) => {
      // Спочатку видаляємо всі зображення галереї
      await tx.image.deleteMany({
        where: { galleryId: params.id }
      });
      
      // Видаляємо саму галерею
      await tx.gallery.delete({
        where: { id: params.id }
      });
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery:', error);
    return NextResponse.json({ error: 'Failed to delete gallery' }, { status: 500 });
  }
} 