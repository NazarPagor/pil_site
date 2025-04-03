import { Metadata } from 'next';
import ContactsPageContent from '@/components/contacts/ContactsPageContent';

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
  title: 'Контакти',
  description: 'Зв\'яжіться з Паломницьким центром "Подільський пілігрим". Наші контактні дані, адреса та форма зворотного зв\'язку.',
  keywords: ['контакти', 'паломницький центр', 'подільський пілігрим', 'адреса', 'телефон', 'зв\'язок'],
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: `${getBaseUrl()}/contacts`,
    siteName: 'Подільський пілігрим',
    title: 'Контакти Паломницького центру "Подільський пілігрим"',
    description: 'Зв\'яжіться з Паломницьким центром "Подільський пілігрим". Наші контактні дані, адреса та форма зворотного зв\'язку.',
    images: [{
      url: '/images/contacts-hero.jpg',
      width: 1200,
      height: 630,
      alt: 'Контакти Подільський пілігрим',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Контакти Паломницького центру',
    description: 'Зв\'яжіться з нами для організації вашої духовної подорожі.',
    images: ['/images/contacts-hero.jpg'],
  },
};

export default function ContactsPage() {
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
                "name": "Контакти",
                "item": `${baseUrl}/contacts`
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
            "@type": "ContactPage",
            "name": "Контакти Паломницького центру 'Подільський пілігрим'",
            "description": "Контактна інформація Паломницького центру 'Подільський пілігрим'. Зв'яжіться з нами для організації паломницької подорожі.",
            "url": `${baseUrl}/contacts`,
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+380971234567",
              "contactType": "customer service",
              "email": "info@pilgrim.center",
              "areaServed": "UA",
              "availableLanguage": ["Ukrainian"]
            }
          })
        }}
      />
      <ContactsPageContent />
    </>
  );
} 