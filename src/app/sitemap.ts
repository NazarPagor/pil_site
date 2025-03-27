import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

// Improved environment detection
const isProduction = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production';
const isPreview = process.env.VERCEL_ENV === 'preview' || process.env.NEXT_PUBLIC_IS_PREVIEW === 'true';

// We'll use this in middleware to check for vercel.app preview domains
const isVercelPreviewDomain = (url: string) => url.includes('.vercel.');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Don't generate sitemap for non-production environments or preview sites
  if (!isProduction || isPreview) {
    console.log('Skipping sitemap generation for non-production or preview environment');
    return [];
  }

  // Get the base URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Check if it's a Vercel preview domain
  if (isVercelPreviewDomain(baseUrl)) {
    console.log('Skipping sitemap generation for Vercel preview domain');
    return [];
  }

  // Get all public pages
  const pages = await prisma.page.findMany({
    where: {
      isSystem: false,
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // Get all events
  const events = await prisma.event.findMany({
    where: {
      status: 'upcoming',
    },
    select: {
      id: true,
      updatedAt: true,
    },
  });

  // Static routes
  const routes = [
    '',
    '/events',
    '/gallery',
    '/contacts',
    '/about',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic page routes
  const pageRoutes = pages.map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: page.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Event routes
  const eventRoutes = events.map((event) => ({
    url: `${baseUrl}/events/${event.id}`,
    lastModified: event.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...routes, ...pageRoutes, ...eventRoutes];
} 