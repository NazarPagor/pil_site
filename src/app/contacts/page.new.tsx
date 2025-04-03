import { Metadata } from 'next';
import ContactsPageContent from '@/components/contacts/ContactsPageContent';
import { getBaseUrl } from '../about/page';

export const metadata: Metadata = {
  title: 'Контакти',
  description: 'Контактна інформація Паломницького центру "Подільський пілігрим". Зв\'яжіться з нами для організації паломницької подорожі.',
  keywords: ['контакти', 'паломницький центр', 'подільський пілігрим', 'адреса', 'телефон', 'email'],
  openGraph: {
    title: 'Контакти Паломницького центру',
    description: 'Зв\'яжіться з нами для організації вашої духовної подорожі.',
    type: 'website',
    locale: 'uk_UA',
    url: getBaseUrl(),
    siteName: 'Подільський пілігрим',
    images: [
      {
        url: '/images/contacts-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Контакти Подільського пілігрима',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Контакти Паломницького центру',
    description: 'Зв\'яжіться з нами для організації вашої духовної подорожі.',
    images: ['/images/contacts-hero.jpg'],
  },
};

export default function ContactsPage() {
  return <ContactsPageContent />;
} 