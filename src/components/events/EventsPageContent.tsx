'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon, MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

// Тип для події
type Event = {
  id: string;
  title: string;
  description: string;
  image: string;
  dates: {
    start: string;
    end: string;
  };
  location: string;
  price: string;
};

// Демо-дані (в реальному додатку отримані через API/БД)
const events: Event[] = [
  {
    id: 'holy-land-2024',
    title: 'Паломництво до Святої Землі',
    description: 'Паломницька поїздка до Святої Землі. Відвідування Єрусалиму, Віфлеєму, Назарету та інших святих місць.',
    image: '/images/events/holy-land.jpg',
    dates: {
      start: '2024-08-15T08:00:00+03:00',
      end: '2024-08-22T20:00:00+03:00',
    },
    location: 'Єрусалим, Ізраїль',
    price: '45000 UAH',
  },
  {
    id: 'zarvanytsia-2024',
    title: 'Паломництво до Зарваниці',
    description: 'Паломництво до Марійського духовного центру в Зарваниці. Участь у прощі та нічних чуваннях.',
    image: '/images/events/zarvanytsia.jpg',
    dates: {
      start: '2024-07-20T07:00:00+03:00',
      end: '2024-07-21T19:00:00+03:00',
    },
    location: 'Тернопільська область, Україна',
    price: '800 UAH',
  },
  {
    id: 'pochaiv-2024',
    title: 'Паломництво до Почаєва',
    description: 'Одноденне паломництво до Почаївської лаври - одного з найбільших православних монастирів України.',
    image: '/images/events/pochaiv.jpg',
    dates: {
      start: '2024-06-15T07:00:00+03:00',
      end: '2024-06-15T21:00:00+03:00',
    },
    location: 'Почаїв, Тернопільська область',
    price: '400 UAH',
  },
  {
    id: 'medjugorje-2024',
    title: 'Паломництво до Меджугорє',
    description: 'Паломництво до відомого місця обявлень Богородиці в Боснії і Герцеговині.',
    image: '/images/events/medjugorje.jpg',
    dates: {
      start: '2024-09-10T05:00:00+03:00',
      end: '2024-09-17T22:00:00+03:00',
    },
    location: 'Меджугорє, Боснія і Герцеговина',
    price: '32000 UAH',
  }
];

const EventsPageContent = () => {
  return (
    <div className="bg-gray-50 min-h-screen pt-24">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4 drop-shadow-sm">
            Паломницькі поїздки
          </h1>
          <div className="w-20 h-1 mx-auto bg-primary-600 mb-6"></div>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Розклад паломницьких поїздок від Паломницького центру "Подільський пілігрим".
            Оберіть духовну подорож до святих місць України та світу.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => {
            // Форматування дат
            const startDate = parseISO(event.dates.start);
            const endDate = parseISO(event.dates.end);
            const formattedStartDate = format(startDate, 'd MMMM yyyy', { locale: uk });
            const sameDay = format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd');
            
            return (
              <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={event.image}
                    alt={event.title}
                    layout="fill"
                    objectFit="cover"
                    className="w-full"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-primary-900 mb-2">
                    {event.title}
                  </h2>
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-primary-700 mr-2" />
                      <span className="text-gray-800 text-sm">
                        {sameDay 
                          ? formattedStartDate 
                          : `${formattedStartDate} - ${format(endDate, 'd MMMM yyyy', { locale: uk })}`
                        }
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 text-primary-700 mr-2" />
                      <span className="text-gray-800 text-sm">{event.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-primary-800 font-semibold">
                      {event.price}
                    </span>
                    <Link href={`/events/${event.id}`} className="inline-flex items-center text-primary-700 hover:text-primary-800">
                      Детальніше
                      <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-primary-900 mb-4">Не знайшли підходящої поїздки?</h2>
          <p className="text-gray-700 mb-6">
            Зв'яжіться з нами, і ми допоможемо підібрати оптимальний варіант або організувати індивідуальну поїздку.
          </p>
          <Link
            href="/contacts"
            className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
          >
            Зв'язатися з нами
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventsPageContent; 