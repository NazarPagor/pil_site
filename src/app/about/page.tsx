import { Metadata } from 'next';
import AboutPageContent from '@/components/about/AboutPageContent';

// Функція для отримання базового URL, яка буде використовуватись в метаданих
export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
};

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
        url: "/images/logo.png",
        width: 500,
        height: 500,
        alt: "Логотип Подільський пілігрим",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Про нас",
    description: "Дізнайтеся більше про Паломницький центр 'Подільський пілігрим'. Наша місія, цінності та історія.",
    images: ['/images/logo.png'],
  },
};

export default function AboutPage() {
  const baseUrl = getBaseUrl();
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Головна",
                "item": baseUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Про нас",
                "item": `${baseUrl}/about`
              }
            ]
          })
        }}
      />
      <AboutPageContent />
    </>
  );
} 