import { Metadata } from 'next';
import EventsPageContent from '@/components/events/EventsPageContent';
import MainLayout from '@/components/layout/MainLayout';
import { getBaseUrl } from '@/lib/getBaseUrl';


export const metadata: Metadata = {
  title: 'Паломницькі поїздки',
  description: 'Каталог паломницьких поїздок від Паломницького центру "Подільський пілігрим" до святих місць України та світу.',
  keywords: ['паломницькі поїздки', 'паломницький центр', 'подільський пілігрим', 'каталог поїздок', 'розклад паломництв'],
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: `${getBaseUrl()}/events`,
    siteName: 'Подільський пілігрим',
    title: 'Паломницькі поїздки - Подільський пілігрим',
    description: 'Каталог паломницьких поїздок від Паломницького центру "Подільський пілігрим" до святих місць України та світу.',
    images: [
      {
        url: "/logo.png",
        width: 500,
        height: 500,
        alt: "Логотип",
      },
    ],
  }
};



export default function EventsPage() {
  const baseUrl = getBaseUrl();
  
  return (
    <MainLayout>
      <EventsPageContent />
    </MainLayout>
  );
} 