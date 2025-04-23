import { Metadata } from 'next';


const baseTitle = 'Паломницький центр - Духовні подорожі до святих місць';

export const defaultMetadata: Metadata = {
  metadataBase: new URL('https://pilgrim.podilsk.com/'),
  title: {
    default: baseTitle,
    template: `%s | Паломницький центр`
  },
  description: 'Організовуємо паломницькі поїздки до святих місць по всьому світу. Духовний супровід, комфортні умови, незабутні враження.',
  keywords: ['паломництво', 'духовні подорожі', 'святі місця', 'православні святині'],
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: 'https://pilgrim.podilsk.com/',
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