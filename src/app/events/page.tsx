'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AnimateOnScroll from '../../components/AnimateOnScroll';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  price: number;
  image: string;
  status: 'upcoming' | 'past';
  difficulty: string;
  includes: string[];
  maxParticipants: number;
  currentParticipants: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Функція для фільтрації подій
  const getFilteredEvents = () => {
    let filteredEvents = [...events];
    
    if (filter === 'upcoming') {
      filteredEvents = filteredEvents.filter(event => event.status === 'upcoming');
    } else if (filter === 'past') {
      filteredEvents = filteredEvents.filter(event => event.status === 'past');
    }
    
    // Сортування подій
    if (sortBy === 'date') {
      filteredEvents.sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateA - dateB;
      });
    } else if (sortBy === 'price-low') {
      filteredEvents.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filteredEvents.sort((a, b) => b.price - a.price);
    }
    
    return filteredEvents;
  };

  const filteredEvents = getFilteredEvents();

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AnimateOnScroll animation="fade-in-up">
        <h1 className="text-4xl font-bold text-center mb-8">Паломницькі подорожі</h1>
      </AnimateOnScroll>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Всі
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-md ${
              filter === 'upcoming'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Майбутні
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-md ${
              filter === 'past'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Минулі
          </button>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-md bg-gray-200 text-gray-700"
        >
          <option value="date">За датою</option>
          <option value="price-low">За ціною (зростання)</option>
          <option value="price-high">За ціною (спадання)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <AnimateOnScroll key={event.id} animation="fade-in-up">
            <div
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedEvent(event.id)}
            >
              <div className="relative h-48">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{formatDate(event.startDate)}</span>
                  <span>{calculateDuration(event.startDate, event.endDate)} днів</span>
                  <span>{event.price} грн</span>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        ))}
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">
                  {events.find(e => e.id === selectedEvent)?.title}
                </h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="relative h-64 mb-4">
                <Image
                  src={events.find(e => e.id === selectedEvent)?.image || ''}
                  alt={events.find(e => e.id === selectedEvent)?.title || ''}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <p className="text-gray-600 mb-4">
                {events.find(e => e.id === selectedEvent)?.description}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold mb-2">Дата</h3>
                  <p className="text-gray-600">
                    {formatDate(events.find(e => e.id === selectedEvent)?.startDate || '')} -{' '}
                    {formatDate(events.find(e => e.id === selectedEvent)?.endDate || '')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Локація</h3>
                  <p className="text-gray-600">
                    {events.find(e => e.id === selectedEvent)?.location}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Ціна</h3>
                  <p className="text-gray-600">
                    {events.find(e => e.id === selectedEvent)?.price} грн
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Складність</h3>
                  <p className="text-gray-600">
                    {events.find(e => e.id === selectedEvent)?.difficulty}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Включено</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {events.find(e => e.id === selectedEvent)?.includes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 