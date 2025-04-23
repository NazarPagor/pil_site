import { Metadata } from 'next';
import FAQPageContent from '@/components/faq/FAQPageContent';
import { getBaseUrl } from '@/lib/getBaseUrl';



export const metadata: Metadata = {
  title: 'Часті питання',
  description: 'Відповіді на найпоширеніші запитання про паломницькі поїздки та послуги Паломницького центру "Подільський пілігрим".',
  keywords: ['часті питання', 'FAQ', 'паломницький центр', 'подільський пілігрим', 'запитання', 'відповіді'],
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: `${getBaseUrl()}/faq`,
    siteName: 'Подільський пілігрим',
    title: 'Часті питання - Подільський пілігрим',
    description: 'Відповіді на найпоширеніші запитання про паломницькі поїздки та послуги Паломницького центру "Подільський пілігрим".',
    images: [{
      url: '/images/logo.png',
      width: 500,
      height: 500,
      alt: 'Подільський пілігрим логотип',
    }],
  },
};


export default function FAQPage() {
  return (
    <FAQPageContent />
  );
} 