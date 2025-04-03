import { Metadata } from 'next';
import { getBaseUrl } from '../about/page';

export const metadata: Metadata = {
  title: 'Галерея',
  description: 'Фотогалерея паломницьких подорожей від Паломницького центру "Подільський пілігрим". Моменти духовних подорожей та паломництв.',
  keywords: ['галерея', 'фото', 'паломництво', 'подорожі', 'подільський пілігрим', 'святі місця'],
  openGraph: {
    title: 'Галерея паломницьких подорожей',
    description: 'Перегляньте фотографії з наших паломницьких подорожей до святих місць.',
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