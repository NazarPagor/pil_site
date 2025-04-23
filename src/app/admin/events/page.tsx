'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  status: string;
  price: number;
  currency: string;
  image: string;
}

export default function EventsAdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/events');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        setEvents(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
        setError('Помилка завантаження заходів. Спробуйте знову пізніше.');
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update event status');
      }
      
      setEvents(events.map(event => 
        event.id === id ? { ...event, status: newStatus } : event
      ));
    } catch (error) {
      console.error('Error updating event status:', error);
      setError('Failed to update event status');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей захід?')) {
      try {
        const response = await fetch(`/api/events/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete event');
        }
        
        setEvents(events.filter(event => event.id !== id));
      } catch (error) {
        console.error('Error deleting event:', error);
        setError('Failed to delete event');
      }
    }
  };

  const toggleExpandEvent = (id: string) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-primary-800">Керування подіями</h1>
        <Link 
          href="/admin/events/new" 
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-center sm:text-left"
        >
          Створити нову подію
        </Link>
      </div>
      
      {/* Десктопна таблиця */}
      <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Назва
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Місце
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ціна
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Валюта
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Немає заходів для відображення
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {event.image && (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={event.image}
                              alt={event.title}
                            />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format(parseISO(event.startDate), 'd MMMM yyyy', { locale: uk })}
                        {event.endDate && (
                          <span> - {format(parseISO(event.endDate), 'd MMMM yyyy', { locale: uk })}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{event.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{event.price} {event.currency === 'UAH' ? 'грн' : event.currency === 'USD' ? '$' : '€'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{event.currency === 'UAH' ? 'грн' : event.currency === 'USD' ? '$' : '€'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${event.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {event.status === 'active' ? 'Активний' : 'Неактивний'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleToggleStatus(event.id, event.status)}
                          className={`px-3 py-1 rounded-md text-xs font-medium ${
                            event.status === 'active' 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {event.status === 'active' ? 'Деактивувати' : 'Активувати'}
                        </button>
                        <Link
                          href={`/admin/events/${event.id}`}
                          className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md text-xs font-medium hover:bg-indigo-200"
                        >
                          Редагувати
                        </Link>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-xs font-medium hover:bg-red-200"
                        >
                          Видалити
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Мобільний список карток */}
      <div className="sm:hidden space-y-4">
        {events.length === 0 ? (
          <div className="bg-white p-4 rounded-lg text-center text-gray-500">
            Немає заходів для відображення
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {event.image && (
                      <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={event.image}
                        alt={event.title}
                      />
                    )}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 truncate max-w-[140px]">{event.title}</h3>
                      <span 
                        className={`inline-flex mt-1 px-2 text-xs leading-5 font-semibold rounded-full 
                        ${event.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {event.status === 'active' ? 'Активний' : 'Неактивний'}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleExpandEvent(event.id)}
                    className="text-gray-500 p-1"
                  >
                    <svg className={`w-5 h-5 transform transition-transform ${expandedEventId === event.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {expandedEventId === event.id && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-gray-500">Дата:</span>
                        <p className="text-sm text-gray-700">
                          {format(parseISO(event.startDate), 'd MMMM yyyy', { locale: uk })}
                          {event.endDate && (
                            <span> - {format(parseISO(event.endDate), 'd MMMM yyyy', { locale: uk })}</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Місце:</span>
                        <p className="text-sm text-gray-700">{event.location}</p>
                      </div>
                      <div className="mb-2">
                        <div className="text-sm font-medium text-gray-700">Вартість:</div>
                        <div className="text-sm text-gray-900">{event.price} {event.currency === 'UAH' ? 'грн' : event.currency === 'USD' ? '$' : '€'}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleToggleStatus(event.id, event.status)}
                        className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium ${
                          event.status === 'active' 
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {event.status === 'active' ? 'Деактивувати' : 'Активувати'}
                      </button>
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="flex-1 px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-md text-xs font-medium hover:bg-indigo-200 text-center"
                      >
                        Редагувати
                      </Link>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="flex-1 px-3 py-1.5 bg-red-100 text-red-800 rounded-md text-xs font-medium hover:bg-red-200"
                      >
                        Видалити
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 