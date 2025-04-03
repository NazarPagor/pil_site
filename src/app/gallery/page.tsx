import { Metadata } from 'next';
import GalleryPageContent from '@/components/gallery/GalleryPageContent';

// Функція для отримання базового URL, яка буде використовуватись в метаданих
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
};

export const metadata: Metadata = {
  title: 'Галерея',
  description: 'Фотогалерея паломницьких подорожей та заходів Паломницького центру "Подільський пілігрим". Моменти духовних подорожей та паломництв.',
  keywords: ['галерея', 'паломницький центр', 'подільський пілігрим', 'фото', 'подорожі', 'заходи', 'подільський пілігрим', 'святі місця'],
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: `${getBaseUrl()}/gallery`,
    siteName: 'Подільський пілігрим',
    title: 'Галерея - Подільський пілігрим',
    description: 'Фотогалерея паломницьких подорожей та заходів Паломницького центру "Подільський пілігрим". Перегляньте фотографії з наших паломницьких подорожей до святих місць.',
    images: [
      {
        url: '/images/gallery-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Галерея Подільського пілігрима',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Галерея паломницьких подорожей',
    description: 'Перегляньте фотографії з наших паломницьких подорожей до святих місць.',
    images: ['/images/gallery-hero.jpg'],
  },
};

export default function GalleryPage() {
  return <GalleryPageContent />;
} 