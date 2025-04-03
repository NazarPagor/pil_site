import { Metadata } from 'next';
import FAQPageContent from '@/components/faq/FAQPageContent';

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
  twitter: {
    card: 'summary_large_image',
    title: 'Часті запитання (FAQ)',
    description: 'Відповіді на поширені запитання про паломницькі поїздки від Подільського пілігрима.',
    images: ['/images/logo.png'],
  },
};

// Приклад питань і відповідей для schema.org
const faqItems = [
  {
    question: "Які документи потрібні для паломницької поїздки за кордон?",
    answer: "Для поїздки за кордон вам необхідно мати закордонний паспорт (термін дії не менше 6 місяців після дати повернення), візу (якщо необхідно для країни призначення), та медичну страховку. Детальніша інформація надається при бронюванні конкретної поїздки."
  },
  {
    question: "Як можна оплатити паломницьку поїздку?",
    answer: "Оплату можна здійснити готівкою у нашому офісі або банківським переказом на рахунок. При бронюванні вноситься передоплата (зазвичай 30% від вартості), а повна оплата має бути здійснена не пізніше ніж за 14 днів до початку поїздки."
  },
  {
    question: "Чи можлива відмова від поїздки та повернення коштів?",
    answer: "Так, відмова можлива. Умови повернення коштів залежать від терміну до початку поїздки: при відмові більше ніж за 30 днів – повертається повна сума мінус адміністративні витрати, від 30 до 14 днів – повертається 70% суми, від 14 до 7 днів – 50%, менше 7 днів – кошти не повертаються."
  },
  {
    question: "Що включено у вартість поїздки?",
    answer: "Зазвичай у вартість включено: транспортне обслуговування, проживання, харчування (згідно з програмою), медичне страхування, послуги гіда, вхідні квитки до зазначених у програмі місць. Детально перелік послуг вказується в описі кожної поїздки."
  },
  {
    question: "Чи потрібно брати з собою їжу в паломницьку поїздку?",
    answer: "Для поїздок з харчуванням, включеним у вартість, додатково брати їжу не обов'язково. Рекомендуємо мати з собою воду та невеликий перекус. Для поїздок без включеного харчування, інформація про можливості харчування надається окремо."
  }
];

export default function FAQPage() {
  const baseUrl = getBaseUrl();
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Головна",
                "item": baseUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Часті запитання",
                "item": `${baseUrl}/faq`
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map(item => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
              }
            }))
          })
        }}
      />
      <FAQPageContent />
    </>
  );
} 