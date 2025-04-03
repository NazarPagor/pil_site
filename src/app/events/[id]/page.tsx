import { Metadata } from 'next';
import EventDetailPageContent from '@/components/events/EventDetailPageContent';

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

// Функція для отримання динамічних даних для метаданих
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // В реальному додатку тут мав би бути запит до API/БД для отримання даних поїздки
  // Поки використовуємо фіктивні дані
  const eventId = params.id;
  let title = 'Паломницька поїздка';
  let description = 'Детальна інформація про паломницьку поїздку від Паломницького центру "Подільський пілігрим".';
  const baseUrl = getBaseUrl();
  
  // Приклад використання ID для створення динамічних метаданих
  if (eventId === 'holy-land-2024') {
    title = 'Паломництво до Святої Землі';
    description = 'Паломницька поїздка до Святої Землі. Відвідування Єрусалиму, Віфлеєму, Назарету та інших святих місць.';
  } else if (eventId === 'zarvanytsia-2024') {
    title = 'Паломництво до Зарваниці';
    description = 'Паломництво до Марійського духовного центру в Зарваниці. Участь у прощі та нічних чуваннях.';
  }
  
  return {
    title,
    description,
    keywords: ['паломництво', 'поїздка', 'подільський пілігрим', 'духовна подорож', params.id],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'uk_UA',
      url: `${baseUrl}/events/${params.id}`,
      siteName: 'Подільський пілігрим',
      images: [
        {
          url: `/images/events/${params.id}.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/images/events/${params.id}.jpg`],
    },
  };
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const baseUrl = getBaseUrl();
  
  // Демо-дані для схеми Product
  let eventData = {
    name: 'Паломницька поїздка',
    description: 'Детальна інформація про паломницьку поїздку від Паломницького центру "Подільський пілігрим".',
    image: `/images/events/${params.id}.jpg`,
    price: '5000 UAH',
    startDate: '2024-08-15T08:00:00+03:00',
    endDate: '2024-08-22T20:00:00+03:00',
    location: 'Україна'
  };
  
  // Залежно від ID налаштовуємо дані
  if (params.id === 'holy-land-2024') {
    eventData = {
      name: 'Паломництво до Святої Землі',
      description: 'Паломницька поїздка до Святої Землі. Відвідування Єрусалиму, Віфлеєму, Назарету та інших святих місць.',
      image: '/images/events/holy-land.jpg',
      price: '45000 UAH',
      startDate: '2024-08-15T08:00:00+03:00',
      endDate: '2024-08-22T20:00:00+03:00',
      location: 'Єрусалим, Ізраїль'
    };
  } else if (params.id === 'zarvanytsia-2024') {
    eventData = {
      name: 'Паломництво до Зарваниці',
      description: 'Паломництво до Марійського духовного центру в Зарваниці. Участь у прощі та нічних чуваннях.',
      image: '/images/events/zarvanytsia.jpg',
      price: '800 UAH',
      startDate: '2024-07-20T07:00:00+03:00',
      endDate: '2024-07-21T19:00:00+03:00',
      location: 'Тернопільська область, Україна'
    };
  }
  
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
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": eventData.name,
                "item": `${baseUrl}/events/${params.id}`
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
            "@type": "Product",
            "name": eventData.name,
            "description": eventData.description,
            "image": `${baseUrl}${eventData.image}`,
            "offers": {
              "@type": "Offer",
              "price": eventData.price.split(' ')[0],
              "priceCurrency": "UAH",
              "availability": "https://schema.org/InStock",
              "url": `${baseUrl}/events/${params.id}`
            },
            "brand": {
              "@type": "Brand",
              "name": "Подільський пілігрим"
            },
            "additionalProperty": [
              {
                "@type": "PropertyValue",
                "name": "Дата початку",
                "value": eventData.startDate
              },
              {
                "@type": "PropertyValue",
                "name": "Дата завершення",
                "value": eventData.endDate
              },
              {
                "@type": "PropertyValue",
                "name": "Місце призначення",
                "value": eventData.location
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
            "@type": "Event",
            "name": eventData.name,
            "startDate": eventData.startDate,
            "endDate": eventData.endDate,
            "location": {
              "@type": "Place",
              "name": eventData.location,
              "address": eventData.location
            },
            "image": `${baseUrl}${eventData.image}`,
            "description": eventData.description,
            "offers": {
              "@type": "Offer",
              "price": eventData.price.split(' ')[0],
              "priceCurrency": "UAH",
              "availability": "https://schema.org/InStock",
              "url": `${baseUrl}/events/${params.id}`
            },
            "organizer": {
              "@type": "Organization",
              "name": "Паломницький центр 'Подільський пілігрим'",
              "url": baseUrl
            }
          })
        }}
      />
      <EventDetailPageContent eventId={params.id} />
    </>
  );
} 