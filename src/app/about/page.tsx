import { Metadata } from 'next';
import AboutPageContent from '@/components/about/AboutPageContent';
import MainLayout from '@/components/layout/MainLayout';
import { getBaseUrl } from '@/lib/getBaseUrl';



export const metadata: Metadata = {
  title: "Про нас",
  description: "Дізнайтеся більше про Паломницький центр 'Подільський пілігрим'. Наша місія, цінності та історія.",
  keywords: ['про нас', 'паломницький центр', 'подільський пілігрим', 'історія', 'місія', 'цінності'],
  openGraph: {
    title: "Про нас",
    description: "Дізнайтеся більше про Паломницький центр 'Подільський пілігрим'. Наша місія, цінності та історія.",
    type: "website",
    locale: "uk_UA",
    url: `${getBaseUrl()}/about`,
    siteName: "Подільський пілігрим",
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

export default function AboutPage() {  
  return (
    <MainLayout>
      <AboutPageContent />
    </MainLayout>
  );
} 