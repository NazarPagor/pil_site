import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        startDate: 'desc'
      }
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create event with all fields
    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        longDescription: body.longDescription || '',
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate || body.startDate),
        location: body.location,
        locationDescription: body.locationDescription,
        locationLat: body.locationLat,
        locationLng: body.locationLng,
        price: body.price || 0,
        currency: body.currency || 'UAH',
        maxParticipants: body.maxParticipants || 20,
        availablePlaces: body.availablePlaces,
        duration: body.duration,
        image: body.image || '/images/events/default.jpg',
        galleryImages: body.galleryImages || [],
        difficulty: body.difficulty || 'medium',
        includes: body.includes || [],
        notIncluded: body.notIncluded || [],
        documentsRequired: body.documentsRequired || [],
        scheduleData: body.scheduleData || null,
        status: body.status || 'upcoming',
      },
    });
    
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
} 