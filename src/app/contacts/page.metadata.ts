import { Metadata } from 'next';
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
    images: [{
      url: '/logo.png',
      width: 500,
      height: 500,
      alt: 'Подільський пілігрим логотип',
    }],
  },
}; 