import { Metadata } from 'next';
import { getBaseUrl } from './page';

export const metadata: Metadata = {
  title: 'Про нас',
  description: 'Дізнайтеся більше про Паломницький центр "Подільський пілігрим". Наша місія, цінності та історія.',
  keywords: ['про нас', 'паломницький центр', 'подільський пілігрим', 'історія', 'місія', 'цінності'],
  openGraph: {
    title: 'Про Паломницький центр "Подільський пілігрим"',
    description: 'Дізнайтеся більше про наш паломницький центр, нашу місію та цінності.',
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