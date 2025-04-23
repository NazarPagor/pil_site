import { Metadata } from 'next';
import GalleryPageContent from '@/components/gallery/GalleryPageContent';
import MainLayout from '@/components/layout/MainLayout';
import { getBaseUrl } from '@/lib/getBaseUrl';


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
        url: "/logo.png",
        width: 500,
        height: 500,
        alt: "Логотип",
      },
    ],
  },
};

export default function GalleryPage() {
  return (
    <MainLayout>
      <GalleryPageContent />
    </MainLayout>
  );
} 