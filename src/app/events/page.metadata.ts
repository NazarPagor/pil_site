import { Metadata } from 'next';
import { getBaseUrl } from '../about/page';

export const metadata: Metadata = {
  title: 'Поїздки та паломництва',
  description: 'Розклад паломницьких поїздок від Паломницького центру "Подільський пілігрим". Святі місця України та світу.',
  keywords: ['поїздки', 'паломництво', 'розклад', 'святі місця', 'подільський пілігрим', 'екскурсії'],
  openGraph: {
    title: 'Паломницькі поїздки від "Подільського пілігрима"',
    description: 'Актуальний розклад паломницьких поїздок до святих місць України та світу.',
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