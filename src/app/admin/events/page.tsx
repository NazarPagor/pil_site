'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  isActive: boolean;
}

export default function EventsAdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        // У майбутньому замінити на реальний API-запит
        const mockEvents: Event[] = [
          {
            id: '1',
            title: 'Паломництво до Зарваниці',
            date: '2023-06-15',
            location: 'Зарваниця, Тернопільська область',
            isActive: true,
          },
          {
            id: '2',
            title: 'Духовні реколекції',
            date: '2023-07-10',
            location: 'Монастир св. Йосафата, Львів',
            isActive: true,
          },
          {
            id: '3',
            title: 'Проща до Гошева',
            date: '2023-08-20',
            location: 'Гошівський монастир, Івано-Франківська область',
            isActive: false,
          },
          {
            id: '4',
            title: 'Різдвяна проща',
            date: '2024-01-07',
            location: 'Катедральний собор, Київ',
            isActive: true,
          },
          {
            id: '5',
            title: 'Великодня проща',
            date: '2024-05-05',
            location: 'Патріарший собор, Київ',
            isActive: true,
          },
        ];
        
        // Імітація завантаження з API
        setTimeout(() => {
          setEvents(mockEvents);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
        setError('Помилка завантаження заходів. Спробуйте знову пізніше.');
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleToggleStatus = (id: string) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, isActive: !event.isActive } : event
    ));
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей захід?')) {
      setEvents(events.filter(event => event.id !== id));
    }
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-800">Управління заходами</h1>
        <Link
          href="/admin/events/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Створити захід
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                Статус
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дії
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{event.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString('uk-UA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{event.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span 
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${event.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {event.isActive ? 'Активний' : 'Неактивний'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleToggleStatus(event.id)}
                      className={`px-3 py-1 rounded-md text-xs font-medium ${
                        event.isActive 
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {event.isActive ? 'Деактивувати' : 'Активувати'}
                    </button>
                    <Link
                      href={`/admin/events/edit/${event.id}`}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 