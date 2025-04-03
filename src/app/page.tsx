import { Metadata } from 'next';
import HomePageContent from '@/components/home/FixHomeContent';

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
  title: "Духовна подорож | Подільський пілігрим",
  description: "Офіційний сайт Паломницького центру 'Подільський пілігрим'. Організація паломницьких подорожей до святих місць України та світу.",
  keywords: ['головна', 'паломницький центр', 'подільський пілігрим', 'паломництво', 'духовні подорожі', 'святі місця'],
  openGraph: {
    title: "Духовна подорож | Подільський пілігрим",
    description: "Офіційний сайт Паломницького центру 'Подільський пілігрим'. Організація паломницьких подорожей до святих місць України та світу.",
    type: "website",
    locale: "uk_UA",
    url: getBaseUrl(),
    siteName: "Подільський пілігрим",
    images: [
      {
        url: "/images/logo.png",
        width: 300,
        height: 300,
        alt: "Логотип Подільський пілігрим",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Духовна подорож | Подільський пілігрим",
    description: "Офіційний сайт Паломницького центру 'Подільський пілігрим'. Організація паломницьких подорожей до святих місць України та світу.",
    images: ['/images/logo.png'],
  },
};

export default function Home() {
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
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Паломницький центр 'Подільський пілігрим'",
            "image": `${baseUrl}/logo.png`,
            "url": baseUrl,
            "telephone": "+380971234567",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Хмельницький",
              "addressCountry": "UA"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "49.4229999",
              "longitude": "26.9873409"
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday"
                ],
                "opens": "09:00",
                "closes": "18:00"
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Saturday",
                "opens": "10:00",
                "closes": "15:00"
              }
            ],
            "priceRange": "₴₴",
            "description": "Організація паломницьких подорожей до святих місць України та світу."
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            "name": "Паломницький центр 'Подільський пілігрим'",
            "image": `${baseUrl}/logo.png`,
            "url": baseUrl,
            "telephone": "+380971234567",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Хмельницький",
              "addressCountry": "UA"
            },
            "description": "Організація паломницьких подорожей до святих місць України та світу. Духовні подорожі, екскурсії та паломництва.",
            "makesOffer": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "TravelService",
                  "name": "Паломницькі поїздки по Україні"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "TravelService",
                  "name": "Міжнародні паломницькі тури"
                }
              }
            ]
          })
        }}
      />
      <HomePageContent />
    </>
  );
}
