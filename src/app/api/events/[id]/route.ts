import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
    });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: params.id },
    });
    
    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    // Prepare update data with all fields
    const updateData: any = {};
    
    // Update basic fields if provided
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.longDescription !== undefined) updateData.longDescription = body.longDescription;
    if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate);
    if (body.endDate !== undefined) updateData.endDate = new Date(body.endDate);
    if (body.location !== undefined) updateData.location = body.location;
    if (body.locationDescription !== undefined) updateData.locationDescription = body.locationDescription;
    if (body.locationLat !== undefined) updateData.locationLat = body.locationLat;
    if (body.locationLng !== undefined) updateData.locationLng = body.locationLng;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.maxParticipants !== undefined) updateData.maxParticipants = body.maxParticipants;
    if (body.availablePlaces !== undefined) updateData.availablePlaces = body.availablePlaces;
    if (body.duration !== undefined) updateData.duration = body.duration;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.difficulty !== undefined) updateData.difficulty = body.difficulty;
    if (body.status !== undefined) updateData.status = body.status;
    
    // Update array fields if provided
    if (body.includes !== undefined) updateData.includes = body.includes;
    if (body.notIncluded !== undefined) updateData.notIncluded = body.notIncluded;
    if (body.galleryImages !== undefined) updateData.galleryImages = body.galleryImages;
    if (body.documentsRequired !== undefined) updateData.documentsRequired = body.documentsRequired;
    
    // Update JSON fields if provided
    if (body.scheduleData !== undefined) updateData.scheduleData = body.scheduleData;
    
    // Update event
    const event = await prisma.event.update({
      where: { id: params.id },
      data: updateData,
    });
    
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.event.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
} 