import { Metadata } from 'next';
import HomePageContent from '@/components/home/HomePageContent';
import MainLayout from '@/components/layout/MainLayout';
import { getBaseUrl } from '@/lib/getBaseUrl';


export const metadata: Metadata = {
  title: "Подільський пілігрим | Духовна подорож",
  description: "Офіційний сайт Паломницького центру 'Подільський пілігрим'. Організація паломницьких подорожей до святих місць України та світу.",
  keywords: ['головна', 'паломницький центр', 'подільський пілігрим', 'паломництво', 'духовні подорожі', 'святі місця'],
  openGraph: {
    title: "Подільський пілігрим | Духовна подорож",
    description: "Офіційний сайт Паломницького центру 'Подільський пілігрим'. Організація паломницьких подорожей до святих місць України та світу.",
    type: "website",
    locale: "uk_UA",
    url: getBaseUrl(),
    siteName: "Подільський пілігрим",
    images: [
      {
        url: "/logo.png",
        width: 300,
        height: 300,
        alt: "Логотип Подільський пілігрим",
      },
    ],
  }
};

export default function HomePage() {
  const baseUrl = getBaseUrl();
  
  return (
    <MainLayout>
      <HomePageContent />
    </MainLayout>
  );
}
