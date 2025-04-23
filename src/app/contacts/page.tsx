import { Metadata } from 'next';
import ContactsPageContent from '@/components/contacts/ContactsPageContent';
import MainLayout from '@/components/layout/MainLayout';
import { getBaseUrl } from '@/lib/getBaseUrl';


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
    images: [
      {
        url: "/logo.png",
        width: 500,
        height: 500,
        alt: "Логотип",
      },
    ],
  },
};

export default function ContactsPage() {
  const baseUrl = getBaseUrl();
  
  return (
    <MainLayout>
      <ContactsPageContent />
    </MainLayout>
  );
} 