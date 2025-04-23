import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { getBaseUrl } from '@/lib/getBaseUrl';




export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get the base URL
  const baseUrl = getBaseUrl()|| 'https://localhost:3000';
  
  // Get all events
  const events = await prisma.event.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  });

  // Static routes
  const routes = [
    '',
    '/about',
    '/events',
    '/gallery',
    '/contacts',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Event routes
  const eventRoutes = events.map((event) => ({
    url: `${baseUrl}/events/${event.id}`,
    lastModified: event.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...routes, ...eventRoutes];
} 