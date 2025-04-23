'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CalendarIcon, MapPinIcon, CurrencyDollarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';
import EventTabs from './EventTabs';
import EventActionSidebar from './EventActionSidebar';

type EventDetailProps = {
  eventId: string;
};


interface Event {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  startDate: string;
  endDate: string;
  location: string;
  locationDescription?: string;
  locationLat?: number;
  locationLng?: number;
  price: number;
  maxParticipants: number;
  availablePlaces?: number;
  duration?: string;
  difficulty: string;
  status: string;
  includes: string[];
  notIncluded: string[];
  documentsRequired: string[];
  galleryImages: string[];
  scheduleData?: any;
}



const EventDetailPageContent = ({ eventId }: EventDetailProps) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    async function fetchEventData() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/events/${eventId}`);
        
        if (!response.ok) {
          throw new Error(`Помилка завантаження даних про подію: ${response.status}`);
        }
        
        const eventData = await response.json();
        setEvent(eventData);
      } catch (err) {
        console.error('Помилка при отриманні даних події:', err);
        setError('Не вдалося завантажити інформацію про подію. Спробуйте пізніше.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchEventData();
  }, [eventId]);
  
  // Відображення стану завантаження
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen pt-24">
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-700 mx-auto mb-4"></div>
            <p className="text-gray-700">Завантаження інформації про поїздку...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Відображення помилки
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Помилка</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button 
              onClick={() => window.location.href = '/events'}
              className="px-6 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800 transition-colors"
            >
              Повернутися до списку поїздок
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Якщо подію не знайдено
  if (!event) {
    return (
      <div className="bg-gray-50 min-h-screen pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Подію не знайдено</h2>
            <p className="text-gray-700 mb-4">На жаль, інформація про цю поїздку відсутня або була видалена.</p>
            <button 
              onClick={() => window.location.href = '/events'}
              className="px-6 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800 transition-colors"
            >
              Переглянути всі поїздки
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Форматування дат
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  const formattedStartDate = format(startDate, 'd MMMM yyyy', { locale: uk });
  const formattedEndDate = format(endDate, 'd MMMM yyyy', { locale: uk });
  
  // Підготовка даних для відображення
  const eventData = {
    description: event.description,
    longDescription: event.longDescription || '',
    schedule: event.scheduleData || [],
    documents: event.documentsRequired?.map(doc => ({ name: doc, required: true })) || [],
    galleryImages: event.galleryImages || [],
    location: {
      name: event.location,
      description: event.locationDescription || '',
      coordinates: {
        lat: event.locationLat || 49.0,
        lng: event.locationLng || 32.0
      }
    }
  };
  
  const availablePlaces = event.availablePlaces || 0;
  const totalPlaces = event.maxParticipants || 0;
  
  return (
    <div className="bg-gray-50 min-h-screen pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Верхня секція з фото та основною інформацією */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-2/5 relative h-64 md:h-auto">
              <Image
                src={event.image || '/images/events/default.jpg'}
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
                  <span className="text-gray-800">{event.duration || 'Не вказано'}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-primary-700 mr-2" />
                  <span className="text-gray-800">{event.location}</span>
                </div>
                
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-primary-700 mr-2" />
                  <span className="text-gray-800">Вартість: {event.price} UAH</span>
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
              eventData={eventData} 
            />
            
            {/* Включено / не включено у вартість */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  Включено у вартість
                </h2>
                <ul className="space-y-2">
                  {event.includes && event.includes.length > 0 ? (
                    event.includes.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">Інформація про включені послуги відсутня</li>
                  )}
                </ul>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
                <h2 className="text-xl font-semibold text-primary-900 mb-4">
                  Не включено у вартість
                </h2>
                <ul className="space-y-2">
                  {event.notIncluded && event.notIncluded.length > 0 ? (
                    event.notIncluded.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-red-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">Інформація про невключені послуги відсутня</li>
                  )}
                </ul>
              </div>
            </div>    
          </div>
          
          {/* Бічна панель */}
          <div className="lg:w-1/3">
            <EventActionSidebar
              startDate={event.startDate}
              endDate={event.endDate}
              price={`${event.price} UAH`}
              duration={event.duration || 'Не вказано'}
              status={availablePlaces > 0 ? 'open' : 'closed'}
              filledPercentage={totalPlaces > 0 ? Math.round(((totalPlaces - availablePlaces) / totalPlaces) * 100) : 100}
              documentsRequired={event.documentsRequired || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPageContent; 