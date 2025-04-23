import { Metadata } from 'next';


const baseTitle = 'Паломницький центр - Духовні подорожі до святих місць';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: baseTitle,
    template: `%s | Паломницький центр`
  },
  description: 'Організовуємо паломницькі поїздки до святих місць по всьому світу. Духовний супровід, комфортні умови, незабутні враження.',
  keywords: ['паломництво', 'духовні подорожі', 'святі місця', 'православні святині'],
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'Паломницький центр',
    title: baseTitle,
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
};

export const generateMetadata = (page: string, description?: string): Metadata => {
  return {
    ...defaultMetadata,
    title: `${page} | Паломницький центр`,
    description: description || defaultMetadata.description,
  };
}; 