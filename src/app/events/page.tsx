import { Metadata } from 'next';
import EventsPageContent from '@/components/events/EventsPageContent';

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
    images: [{
      url: '/images/events-hero.jpg',
      width: 1200,
      height: 630,
      alt: 'Паломницькі поїздки з Подільським пілігримом',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Паломницькі поїздки',
    description: 'Список поїздок від Подільського пілігрима. Забронюйте місце у духовній подорожі.',
    images: ['/images/events-hero.jpg'],
  },
};

// Приклад даних про поїздки для schema.org
const sampleEvents = [
  {
    name: "Паломництво до Святої Землі",
    startDate: "2024-08-15T08:00:00+03:00",
    endDate: "2024-08-22T20:00:00+03:00",
    location: {
      name: "Свята Земля, Ізраїль",
      address: "Єрусалим, Ізраїль"
    },
    image: `${getBaseUrl()}/images/events/holy-land.jpg`,
    description: "Паломництво до Святої Землі. Відвідування Єрусалиму, Віфлеєму, Назарету та інших святих місць.",
    url: `${getBaseUrl()}/events/holy-land-2024`
  },
  {
    name: "Паломництво до Зарваниці",
    startDate: "2024-07-20T07:00:00+03:00",
    endDate: "2024-07-21T19:00:00+03:00",
    location: {
      name: "Зарваниця",
      address: "Тернопільська область, Україна"
    },
    image: `${getBaseUrl()}/images/events/zarvanytsia.jpg`,
    description: "Паломництво до Марійського духовного центру в Зарваниці. Участь у прощі та нічних чуваннях.",
    url: `${getBaseUrl()}/events/zarvanytsia-2024`
  }
];

export default function EventsPage() {
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
                "name": "Поїздки",
                "item": `${baseUrl}/events`
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
            "@type": "ItemList",
            "itemListElement": sampleEvents.map((event, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Event",
                "name": event.name,
                "startDate": event.startDate,
                "endDate": event.endDate,
                "location": {
                  "@type": "Place",
                  "name": event.location.name,
                  "address": event.location.address
                },
                "image": event.image,
                "description": event.description,
                "url": event.url,
                "organizer": {
                  "@type": "Organization",
                  "name": "Паломницький центр 'Подільський пілігрим'",
                  "url": baseUrl
                }
              }
            }))
          })
        }}
      />
      <EventsPageContent />
    </>
  );
} 