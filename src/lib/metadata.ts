import { Metadata } from 'next';

// We can only check for server-side environment variables here
// Client-side detection happens in the components
const isProduction = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production';
const isPreview = process.env.VERCEL_ENV === 'preview' || process.env.NEXT_PUBLIC_IS_PREVIEW === 'true';

// Preview title will be set on the client side in the PreviewBanner component
// Here we just set a default value
const getTitle = () => {
  let baseTitle = 'Паломницький центр - Духовні подорожі до святих місць';
  if (isPreview) {
    baseTitle = `[PREVIEW] ${baseTitle}`;
  }
  return baseTitle;
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: getTitle(),
    template: isPreview ? `[PREVIEW] %s | Паломницький центр` : `%s | Паломницький центр`
  },
  description: 'Організовуємо паломницькі поїздки до святих місць по всьому світу. Духовний супровід, комфортні умови, незабутні враження.',
  keywords: ['паломництво', 'духовні подорожі', 'святі місця', 'православні святині'],
  authors: [{ name: 'Паломницький центр' }],
  creator: 'Паломницький центр',
  publisher: 'Паломницький центр',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: isProduction && !isPreview,
    follow: isProduction && !isPreview,
    googleBot: {
      index: isProduction && !isPreview,
      follow: isProduction && !isPreview,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'Паломницький центр',
    title: getTitle(),
    description: 'Організовуємо паломницькі поїздки до святих місць по всьому світу. Духовний супровід, комфортні умови, незабутні враження.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Паломницький центр',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: getTitle(),
    description: 'Організовуємо паломницькі поїздки до святих місць по всьому світу. Духовний супровід, комфортні умови, незабутні враження.',
    images: ['/images/og-image.jpg'],
    creator: '@pilgrimage',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const generateMetadata = (page: string, description?: string): Metadata => {
  if (!isProduction || isPreview) {
    return {
      ...defaultMetadata,
      title: isPreview ? `[PREVIEW] ${page} | Паломницький центр` : `${page} | Паломницький центр`,
      robots: {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
    };
  }

  return {
    ...defaultMetadata,
    title: `${page} | Паломницький центр`,
    description: description || defaultMetadata.description,
  };
}; 