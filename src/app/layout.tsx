import { Metadata } from 'next'
import './globals.css';
import MainLayout from '@/components/layout/MainLayout';

// Функція для отримання базового URL, яка буде використовуватись в метаданих
const getBaseUrl = () => {
  return 'https://pilgrim.podilsk.com';
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
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="alternate" hrefLang="uk" href={baseUrl} />
        <link rel="alternate" hrefLang="x-default" href={baseUrl} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
