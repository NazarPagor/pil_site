'use client';

import React from 'react';
import Image from 'next/image';
import { CalendarIcon, MapPinIcon, CurrencyDollarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';
import EventTabs from './EventTabs';
import ReviewsSection from './ReviewsSection';
import RelatedEventsSection from './RelatedEventsSection';
import EventActionSidebar from './EventActionSidebar';

type EventDetailProps = {
  eventId: string;
};

// Демо-дані (в реальному додатку отримані через API/БД)
const getEventData = (eventId: string) => {
  // Для демонстрації використовуємо фіктивні дані, у повноцінному додатку це може бути запит до API
  const events = {
    'holy-land-2024': {
      id: 'holy-land-2024',
      title: 'Паломництво до Святої Землі',
      description: 'Паломницька поїздка до Святої Землі. Відвідування Єрусалиму, Віфлеєму, Назарету та інших святих місць.',
      longDescription: `
        <p>Запрошуємо вас взяти участь у незабутньому паломництві до Святої Землі, де ви матимете можливість відвідати найважливіші біблійні місця.</p>
        <p>Під час паломництва ми відвідаємо Єрусалим, Віфлеєм, Назарет, річку Йордан, Галілейське море та інші святі місця, пов'язані з життям Ісуса Христа.</p>
        <p>Поїздка включає:</p>
        <ul>
          <li>Авіапереліт Київ - Тель-Авів - Київ</li>
          <li>Проживання у готелях 3-4*</li>
          <li>Харчування (сніданки та вечері)</li>
          <li>Трансфери по всьому маршруту</li>
          <li>Екскурсійне обслуговування з україномовним гідом</li>
          <li>Медичне страхування</li>
        </ul>
      `,
      image: '/images/events/holy-land.jpg',
      dates: {
        start: '2024-08-15T08:00:00+03:00',
        end: '2024-08-22T20:00:00+03:00',
      },
      location: {
        name: 'Єрусалим, Ізраїль',
        description: 'Свята Земля - це унікальна можливість доторкнутися до історії християнства, відвідати місця, описані в Біблії, і пройти шляхом, яким ходив Ісус Христос. Єрусалим - священне місто трьох релігій, а також центр паломництва для християн з усього світу.',
        coordinates: {
          lat: 31.768319,
          lng: 35.21371
        }
      },
      price: '45000 UAH',
      availablePlaces: 15,
      totalPlaces: 25,
      duration: '8 днів',
      included: [
        'Авіапереліт',
        'Проживання у готелях 3-4*',
        'Харчування (сніданки та вечері)',
        'Трансфери',
        'Екскурсії',
        'Медичне страхування'
      ],
      notIncluded: [
        'Особисті витрати',
        'Додаткові екскурсії',
        'Чайові для гіда та водія'
      ],
      schedule: [
        {
          day: 1,
          title: 'Виліт та прибуття',
          activities: [
            'Зустріч в аеропорту Києва',
            'Виліт до Тель-Авіву',
            'Прибуття в аеропорт Бен-Гуріон',
            'Трансфер до готелю в Єрусалимі',
            'Поселення, вечеря, відпочинок'
          ]
        },
        {
          day: 2,
          title: 'Єрусалим - Старе місто',
          activities: [
            'Сніданок у готелі',
            'Відвідання Старого міста Єрусалиму',
            'Храм Гробу Господнього',
            'Стіна Плачу',
            'Віа Долороса (Хресна Дорога)',
            'Повернення до готелю, вечеря'
          ]
        },
        {
          day: 3,
          title: 'Віфлеєм',
          activities: [
            'Сніданок у готелі',
            'Поїздка до Віфлеєму',
            'Відвідання Храму Різдва Христового',
            'Поле Пастухів',
            'Повернення до Єрусалиму',
            'Вечеря в готелі'
          ]
        },
        {
          day: 4,
          title: 'Галілея',
          activities: [
            'Сніданок у готелі',
            'Переїзд у Галілею',
            'Відвідання Назарету - Храм Благовіщення',
            'Кана Галілейська',
            'Поселення в готелі в Тіверії',
            'Вечеря та відпочинок'
          ]
        },
        {
          day: 5,
          title: 'Галілейське море',
          activities: [
            'Сніданок у готелі',
            'Відвідання місць служіння Ісуса в Галілеї',
            'Гора Блаженств',
            'Табха (місце чуда з хлібами та рибами)',
            'Капернаум',
            'Човнова прогулянка по Галілейському морю',
            'Вечеря в готелі'
          ]
        },
        {
          day: 6,
          title: 'Річка Йордан і Мертве море',
          activities: [
            'Сніданок у готелі',
            'Відвідання місця хрещення на річці Йордан',
            'Переїзд до Мертвого моря',
            'Вільний час для купання в Мертвому морі',
            'Повернення до Єрусалиму',
            'Вечеря в готелі'
          ]
        },
        {
          day: 7,
          title: 'Єрусалим - Оливкова гора',
          activities: [
            'Сніданок у готелі',
            'Відвідання Оливкової гори',
            'Гетсиманський сад',
            'Церква Всіх Націй',
            'Церква Успіння Богородиці',
            'Вільний час для особистих молитов',
            'Прощальна вечеря'
          ]
        },
        {
          day: 8,
          title: 'Повернення додому',
          activities: [
            'Сніданок у готелі',
            'Виселення з готелю',
            'Трансфер до аеропорту Бен-Гуріон',
            'Виліт до Києва',
            'Прибуття в Київ'
          ]
        }
      ],
      galleryImages: [
        '/images/events/holy-land/gallery-1.jpg',
        '/images/events/holy-land/gallery-2.jpg',
        '/images/events/holy-land/gallery-3.jpg',
        '/images/events/holy-land/gallery-4.jpg',
        '/images/events/holy-land/gallery-5.jpg',
        '/images/events/holy-land/gallery-6.jpg'
      ],
      documentsRequired: [
        'Закордонний паспорт (термін дії не менше 6 місяців після повернення)',
        'Медична страховка (включена у вартість)',
        'Авіаквитки (надаються організатором)'
      ],
      reviews: [
        {
          id: '1',
          author: {
            name: 'Олена Петренко',
            avatar: '/images/reviews/user1.jpg'
          },
          date: '10 травня 2023',
          rating: 5,
          text: 'Надзвичайно духовна подорож! Відвідали всі святі місця, екскурсовод дуже професійний, все було організовано на найвищому рівні. Рекомендую всім, хто хоче доторкнутися до історії християнства.'
        },
        {
          id: '2',
          author: {
            name: 'Михайло Іваненко'
          },
          date: '23 квітня 2023',
          rating: 4,
          text: 'Дуже цікава і змістовна поїздка. Єдиний невеликий мінус - інколи було занадто жарко, але це, звісно, не залежить від організаторів. Готелі були комфортні, харчування смачне.'
        }
      ]
    },
    'zarvanytsia-2024': {
      id: 'zarvanytsia-2024',
      title: 'Паломництво до Зарваниці',
      description: 'Паломництво до Марійського духовного центру в Зарваниці. Участь у прощі та нічних чуваннях.',
      longDescription: `
        <p>Запрошуємо на щорічну всеукраїнську прощу до Марійського духовного центру в Зарваниці.</p>
        <p>Під час паломництва ви матимете можливість взяти участь у Божественній літургії, молебні, нічних чуваннях та процесії зі свічками.</p>
        <p>Програма прощі:</p>
        <ul>
          <li>Участь у Божественній літургії</li>
          <li>Молебень до Богородиці</li>
          <li>Нічні чування</li>
          <li>Процесія зі свічками</li>
          <li>Спільна молитва біля чудотворного джерела</li>
        </ul>
      `,
      image: '/images/events/zarvanytsia.jpg',
      dates: {
        start: '2024-07-20T07:00:00+03:00',
        end: '2024-07-21T19:00:00+03:00',
      },
      location: {
        name: 'Зарваниця, Тернопільська область',
        description: 'Марійський духовний центр у Зарваниці – одна з найбільших святинь УГКЦ, місце паломництва та духовного зростання. Тут знаходиться чудотворна ікона Матері Божої та цілюще джерело, яке, за переказами, має чудодійні властивості.',
        coordinates: {
          lat: 49.2069,
          lng: 25.3837
        }
      },
      price: '800 UAH',
      availablePlaces: 30,
      totalPlaces: 45,
      duration: '2 дні',
      included: [
        'Транспортне обслуговування',
        'Супровід духівника',
        'Організаційні витрати'
      ],
      notIncluded: [
        'Харчування',
        'Особисті витрати'
      ],
      schedule: [
        {
          day: 1,
          title: 'Субота',
          activities: [
            'Виїзд зі Львова о 7:00',
            'Прибуття до Зарваниці',
            'Божественна літургія',
            'Вільний час для обіду',
            'Молебень до Богородиці',
            'Час для особистої молитви',
            'Нічні чування',
            'Процесія зі свічками'
          ]
        },
        {
          day: 2,
          title: 'Неділя',
          activities: [
            'Спільна молитва на світанку',
            'Сніданок',
            'Урочиста Божественна літургія',
            'Відвідання джерела',
            'Вільний час',
            'Виїзд до Львова',
            'Повернення до Львова близько 19:00'
          ]
        }
      ],
      galleryImages: [
        '/images/events/zarvanytsia/gallery-1.jpg',
        '/images/events/zarvanytsia/gallery-2.jpg',
        '/images/events/zarvanytsia/gallery-3.jpg',
        '/images/events/zarvanytsia/gallery-4.jpg'
      ],
      documentsRequired: [
        'Паспорт громадянина України',
        'Речі для ночівлі (за потреби)'
      ],
      reviews: [
        {
          id: '1',
          author: {
            name: 'Марія Ковальчук',
            avatar: '/images/reviews/user2.jpg'
          },
          date: '15 липня 2023',
          rating: 5,
          text: 'Надзвичайна духовна атмосфера! Паломництво до Зарваниці завжди приносить душевний спокій та відновлення. Організація була на високому рівні.'
        }
      ]
    }
  };

  // Повертаємо дані конкретної події або дані за замовчуванням
  return events[eventId as keyof typeof events] || {
    id: eventId,
    title: 'Паломницька поїздка',
    description: 'Детальна інформація про паломницьку поїздку від Паломницького центру "Подільський пілігрим".',
    longDescription: '<p>Детальна інформація про поїздку буде доступна найближчим часом.</p>',
    image: '/images/events/default.jpg',
    dates: {
      start: '2024-10-01T08:00:00+03:00',
      end: '2024-10-05T18:00:00+03:00',
    },
    location: {
      name: 'Україна',
      description: 'Детальна інформація про місце призначення буде доступна найближчим часом.',
      coordinates: {
        lat: 49.0,
        lng: 32.0
      }
    },
    price: '5000 UAH',
    availablePlaces: 20,
    totalPlaces: 20,
    duration: '5 днів',
    included: ['Інформація про включені послуги буде доступна найближчим часом'],
    notIncluded: ['Інформація про невключені послуги буде доступна найближчим часом'],
    schedule: [],
    galleryImages: [],
    documentsRequired: ['Інформація про необхідні документи буде доступна найближчим часом'],
    reviews: []
  };
};

// Демо-дані для схожих поїздок
const getRelatedEvents = (currentEventId: string) => {
  const allEvents = [
    {
      id: 'holy-land-2024',
      title: 'Паломництво до Святої Землі',
      image: '/images/events/holy-land.jpg',
      startDate: '2024-08-15T08:00:00+03:00',
      endDate: '2024-08-22T20:00:00+03:00',
      location: 'Єрусалим, Ізраїль',
      price: '45000 UAH'
    },
    {
      id: 'zarvanytsia-2024',
      title: 'Паломництво до Зарваниці',
      image: '/images/events/zarvanytsia.jpg',
      startDate: '2024-07-20T07:00:00+03:00',
      endDate: '2024-07-21T19:00:00+03:00',
      location: 'Зарваниця, Тернопільська область',
      price: '800 UAH'
    },
    {
      id: 'pochaiv-2024',
      title: 'Паломництво до Почаєва',
      image: '/images/events/pochaiv.jpg',
      startDate: '2024-06-15T07:00:00+03:00',
      endDate: '2024-06-15T21:00:00+03:00',
      location: 'Почаїв, Тернопільська область',
      price: '400 UAH'
    },
    {
      id: 'medjugorje-2024',
      title: 'Паломництво до Меджугорє',
      image: '/images/events/medjugorje.jpg',
      startDate: '2024-09-10T05:00:00+03:00',
      endDate: '2024-09-17T22:00:00+03:00',
      location: 'Меджугорє, Боснія і Герцеговина',
      price: '32000 UAH'
    }
  ];
  
  // Повертаємо всі події, крім поточної
  return allEvents.filter(event => event.id !== currentEventId);
};

const EventDetailPageContent = ({ eventId }: EventDetailProps) => {
  const event = getEventData(eventId);
  const relatedEvents = getRelatedEvents(eventId);
  
  // Форматування дат
  const startDate = parseISO(event.dates.start);
  const endDate = parseISO(event.dates.end);
  const formattedStartDate = format(startDate, 'd MMMM yyyy', { locale: uk });
  const formattedEndDate = format(endDate, 'd MMMM yyyy', { locale: uk });
  
  return (
    <div className="bg-gray-50 min-h-screen pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Верхня секція з фото та основною інформацією */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-2/5 relative h-64 md:h-auto">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8 md:w-3/5">
              <h1 className="text-3xl font-bold text-primary-900 mb-4">{event.title}</h1>
              <p className="text-gray-700 mb-6">{event.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-primary-700 mr-2" />
                  <span className="text-gray-800">
                    {formattedStartDate} - {formattedEndDate}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-primary-700 mr-2" />
                  <span className="text-gray-800">{event.duration}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-primary-700 mr-2" />
                  <span className="text-gray-800">{event.location.name}</span>
                </div>
                
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-primary-700 mr-2" />
                  <span className="text-gray-800">Вартість: {event.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Основний контент та бічна панель */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Основний контент */}
          <div className="lg:w-2/3">
            {/* Вкладки з детальною інформацією */}
            <EventTabs 
              eventId={eventId} 
              eventData={{
                description: event.description,
                longDescription: event.longDescription,
                schedule: event.schedule,
                documents: event.documentsRequired.map(doc => ({ name: doc, required: true })),
                galleryImages: event.galleryImages,
                location: event.location
              }} 
            />
            
            {/* Включено / не включено у вартість */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  Включено у вартість
                </h2>
                <ul className="space-y-2">
                  {event.included.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  Не включено у вартість
                </h2>
                <ul className="space-y-2">
                  {event.notIncluded.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-red-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Відгуки */}
            <ReviewsSection reviews={event.reviews} eventName={event.title} />
            
            {/* Схожі поїздки */}
            {relatedEvents.length > 0 && (
              <RelatedEventsSection events={relatedEvents} />
            )}
          </div>
          
          {/* Бічна панель */}
          <div className="lg:w-1/3">
            <EventActionSidebar
              startDate={event.dates.start}
              endDate={event.dates.end}
              price={event.price}
              duration={event.duration}
              status={event.availablePlaces > 0 ? 'open' : 'closed'}
              filledPercentage={Math.round(((event.totalPlaces - event.availablePlaces) / event.totalPlaces) * 100)}
              documentsRequired={event.documentsRequired}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPageContent; 