import { Metadata } from 'next'
import './globals.css';
import MainLayout from '@/components/layout/MainLayout';

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
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: 'Паломницький центр "Подільський пілігрим"',
    template: '%s | Подільський пілігрим'
  },
  description: 'Організація паломницьких подорожей до святих місць України та світу. Духовні подорожі, екскурсії та паломництва.',
  keywords: ['паломництво', 'паломницький центр', 'подільський пілігрим', 'духовні подорожі', 'святі місця', 'паломницькі тури'],
  authors: [{ name: 'Подільський пілігрим' }],
  creator: 'Подільський пілігрим',
  publisher: 'Подільський пілігрим',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: getBaseUrl(),
    siteName: 'Подільський пілігрим',
    title: 'Паломницький центр "Подільський пілігрим"',
    description: 'Організація паломницьких подорожей до святих місць України та світу',
    images: [{
      url: '/logo.png',
      width: 500,
      height: 500,
      alt: 'Подільський пілігрим логотип',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Паломницький центр "Подільський пілігрим"',
    description: 'Організація паломницьких подорожей до святих місць України та світу',
    images: ['/logo.png'],
    creator: '@pilgrim_center',
  },
  alternates: {
    canonical: getBaseUrl(),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl = getBaseUrl();
  
  return (
    <html lang="uk">
      <head>
        <link rel="alternate" hrefLang="uk" href={baseUrl} />
        <link rel="alternate" hrefLang="x-default" href={baseUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Подільський пілігрим",
              "url": baseUrl,
              "logo": `${baseUrl}/logo.png`,
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+380971234567",
                "contactType": "customer service",
                "availableLanguage": ["Ukrainian"]
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Хмельницький",
                "addressCountry": "UA"
              },
              // "sameAs": [
              //   "https://facebook.com/pilgrim.center",
              //   "https://instagram.com/pilgrim.center"
              // ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": baseUrl,
              "name": "Подільський пілігрим",
              "description": "Офіційний сайт Паломницького центру 'Подільський пілігрим'. Організація паломницьких подорожей до святих місць України та світу.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${baseUrl}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body><MainLayout>{children}</MainLayout></body>
    </html>
  );
}
