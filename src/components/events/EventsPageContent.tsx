'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon, MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

// Тип для події
interface Event {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  startDate: string;
  endDate?: string;
  location: string;
  locationDescription?: string;
  locationLat?: number;
  locationLng?: number;
  price: number;
  maxParticipants: number;
  availablePlaces?: number;
  duration?: string;
  image: string;
  galleryImages?: string[];
  difficulty: string;
  includes: string[];
  notIncluded?: string[];
  documentsRequired?: string[];
  scheduleData?: Array<{
    day: number;
    title: string;
    activities: string[];
  }>;
  status: string;
}

const EventsPageContent = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Не вдалося завантажити дані про поїздки');
        }
        const data = await response.json();
        
        // Фільтруємо тільки події зі статусом active
        const filteredEvents = data.filter((event: Event) => 
          event.status === 'active'
        );
        
        // Сортуємо за датою початку
        filteredEvents.sort((a: Event, b: Event) => 
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
        
        setEvents(filteredEvents);
        setIsLoading(false);
      } catch (error) {
        console.error('Помилка при завантаженні даних:', error);
        setError('Не вдалося завантажити дані про поїздки. Спробуйте пізніше.');
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen pt-24">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4 drop-shadow-sm">
              Паломницькі поїздки
            </h1>
            <div className="w-20 h-1 mx-auto bg-primary-600 mb-6"></div>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen pt-24">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4 drop-shadow-sm">
              Паломницькі поїздки
            </h1>
            <div className="w-20 h-1 mx-auto bg-primary-600 mb-6"></div>
          </div>
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Спробувати знову
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => {
              // Форматування дат
              const startDate = parseISO(event.startDate);
              const endDate = event.endDate ? parseISO(event.endDate) : startDate;
              const formattedStartDate = format(startDate, 'd MMMM yyyy', { locale: uk });
              const sameDay = format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd');
              
              // Форматування ціни
              const formattedPrice = new Intl.NumberFormat('uk-UA', {
                style: 'currency',
                currency: 'UAH',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(event.price);
              
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
                        {formattedPrice}
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
        ) : (
          <div className="text-center p-8 bg-gray-100 rounded-lg">
            <p className="text-lg text-gray-700">
              На даний момент немає запланованих поїздок. Перевірте пізніше, або зв'яжіться з нами.
            </p>
          </div>
        )}
        
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