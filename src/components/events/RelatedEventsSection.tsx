'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon, MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

type EventCard = {
  id: string;
  title: string;
  image: string;
  startDate: string;
  endDate: string;
  location: string;
  price: string;
};

type RelatedEventsSectionProps = {
  events: EventCard[];
};

const RelatedEventsSection: React.FC<RelatedEventsSectionProps> = ({ events }) => {
  if (events.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 mb-10">
      <h2 className="text-2xl font-semibold text-primary-900 mb-2">
        Схожі поїздки
      </h2>
      <p className="text-gray-600 mb-8">
        Інші паломницькі поїздки, які можуть вас зацікавити
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => {
          // Форматування дат
          const startDate = parseISO(event.startDate);
          const endDate = parseISO(event.endDate);
          const formattedStartDate = format(startDate, 'd MMMM yyyy', { locale: uk });
          const sameDay = format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd');
          
          return (
            <div 
              key={event.id} 
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-40">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-lg text-primary-900 mb-2 line-clamp-1">
                  {event.title}
                </h3>
                
                <div className="space-y-1 mb-3 text-sm">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 text-primary-700 mr-2" />
                    <span className="text-gray-700">
                      {sameDay 
                        ? formattedStartDate 
                        : `${formattedStartDate} - ${format(endDate, 'd MMMM', { locale: uk })}`
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 text-primary-700 mr-2" />
                    <span className="text-gray-700 line-clamp-1">{event.location}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-primary-800 font-semibold">
                    {event.price}
                  </span>
                  <Link 
                    href={`/events/${event.id}`}
                    className="inline-flex items-center text-sm text-primary-700 hover:text-primary-800"
                  >
                    Детальніше
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedEventsSection; 