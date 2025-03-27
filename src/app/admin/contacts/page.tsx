'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export default function ContactsAdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/contact');
        
        if (!response.ok) {
          throw new Error('Помилка завантаження контактів');
        }
        
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setError('Не вдалося завантажити контакти');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContacts();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      });

      if (!response.ok) {
        throw new Error('Помилка оновлення контакту');
      }

      // Оновлення локального стану
      setContacts(prevContacts =>
        prevContacts.map(contact =>
          contact.id === id ? { ...contact, isRead: true } : contact
        )
      );

      if (selectedContact?.id === id) {
        setSelectedContact(prev => prev ? { ...prev, isRead: true } : null);
      }
    } catch (error) {
      console.error('Error marking contact as read:', error);
      alert('Помилка при позначенні контакту як прочитаного');
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цей контакт?')) {
      return;
    }

    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Помилка видалення контакту');
      }

      // Оновлення локального стану
      setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
      
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Помилка при видаленні контакту');
    }
  };

  const filteredContacts = useMemo(() => {
    switch (filter) {
      case 'read':
        return contacts.filter(contact => contact.isRead);
      case 'unread':
        return contacts.filter(contact => !contact.isRead);
      default:
        return contacts;
    }
  }, [contacts, filter]);

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
      <div>
        <h1 className="text-2xl font-bold text-primary-800">Управління повідомленнями</h1>
        <p className="mt-1 text-sm text-gray-500">
          Перегляд та керування повідомленнями, отриманими через контактну форму.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex border-b">
          {/* Sidebar з листом повідомлень */}
          <div className="w-full lg:w-2/5 border-r">
            <div className="p-4 border-b">
              <div className="flex mb-4 space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Всі
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filter === 'unread'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Непрочитані
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filter === 'read'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Прочитані
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Немає повідомлень</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {filter === 'all' ? 'У вас немає повідомлень.' : filter === 'unread' ? 'У вас немає непрочитаних повідомлень.' : 'У вас немає прочитаних повідомлень.'}
                  </p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => {
                      setSelectedContact(contact);
                      if (!contact.isRead) {
                        handleMarkAsRead(contact.id);
                      }
                    }}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedContact?.id === contact.id ? 'bg-gray-50' : ''
                    } ${!contact.isRead ? 'bg-blue-50 hover:bg-blue-100' : ''}`}
                  >
                    <div className="flex justify-between">
                      <h3 className={`text-sm font-medium ${!contact.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                        {contact.name}
                      </h3>
                      <time className="text-xs text-gray-500">
                        {new Date(contact.createdAt).toLocaleDateString('uk-UA')}
                      </time>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 truncate">{contact.subject}</p>
                    <p className="text-xs text-gray-400 mt-1 truncate">{contact.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Область перегляду повідомлення */}
          <div className="hidden lg:block w-3/5">
            {selectedContact ? (
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{selectedContact.subject}</h2>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span>Від: {selectedContact.name}</span>
                      <span className="mx-2">&bull;</span>
                      <span>{new Date(selectedContact.createdAt).toLocaleString('uk-UA')}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!selectedContact.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(selectedContact.id)}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium hover:bg-blue-200"
                      >
                        Позначити як прочитане
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteContact(selectedContact.id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-xs font-medium hover:bg-red-200"
                    >
                      Видалити
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Email:</p>
                      <p className="font-medium">{selectedContact.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Телефон:</p>
                      <p className="font-medium">{selectedContact.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>

                <div className="mt-6 border-t pt-4">
                  <Link
                    href={`mailto:${selectedContact.email}`}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 inline-flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Відповісти
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Оберіть повідомлення</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Виберіть повідомлення зі списку, щоб переглянути його деталі.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 