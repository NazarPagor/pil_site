import { Metadata } from 'next';
import { getBaseUrl } from './about/page';

export const metadata: Metadata = {
  title: 'Головна',
  description: 'Офіційний сайт Паломницького центру "Подільський пілігрим". Організація паломницьких подорожей до святих місць України та світу.',
  keywords: ['головна', 'паломницький центр', 'подільський пілігрим', 'паломництво', 'духовні подорожі', 'святі місця'],
  openGraph: {
    title: 'Паломницький центр "Подільський пілігрим"',
    description: 'Організація паломницьких подорожей до святих місць України та світу.',
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