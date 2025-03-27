'use client';

import { useState, useEffect } from 'react';
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
        // У майбутньому замінити на реальний API-запит
        const mockContacts: Contact[] = [
          {
            id: '1',
            name: 'Іван Петренко',
            email: 'ivan.petrenko@example.com',
            phone: '+380961234567',
            subject: 'Запитання про паломництво',
            message: 'Доброго дня! Хотів би дізнатися більше про найближче паломництво до Зарваниці. Яка вартість і як можна зареєструватися?',
            createdAt: '2023-10-15T09:30:00Z',
            isRead: false,
          },
          {
            id: '2',
            name: 'Марія Коваленко',
            email: 'mariya.kovalenko@example.com',
            phone: '+380972345678',
            subject: 'Замовлення групового паломництва',
            message: 'Вітаю! Наша парафія хотіла б організувати групове паломництво до Гошева в серпні. Можливо у вас є спеціальні пропозиції для груп від 20 осіб?',
            createdAt: '2023-10-10T14:15:00Z',
            isRead: true,
          },
          {
            id: '3',
            name: 'Петро Василенко',
            email: 'petro.vasylenko@example.com',
            phone: '+380983456789',
            subject: 'Уточнення програми',
            message: 'Добрий день! Зацікавився вашим паломництвом до Риму. Хотів би уточнити програму поїздки та чи включені до вартості квитки на авіапереліт?',
            createdAt: '2023-10-05T11:45:00Z',
            isRead: false,
          },
          {
            id: '4',
            name: 'Олена Сидоренко',
            email: 'olena.sydorenko@example.com',
            phone: '+380994567890',
            subject: 'Необхідні документи',
            message: 'Добрий день! Підкажіть, будь ласка, які документи необхідні для участі в паломництві до Єрусалиму? Чи потрібно робити додаткові щеплення?',
            createdAt: '2023-09-28T16:20:00Z',
            isRead: true,
          },
          {
            id: '5',
            name: 'Андрій Мельник',
            email: 'andriy.melnyk@example.com',
            phone: '+380505678901',
            subject: 'Духовний супровід',
            message: 'Вітаю! Цікавить, хто буде духовним наставником під час паломництва до Люрду? Чи будуть проводитися спільні молитви та духовні бесіди?',
            createdAt: '2023-09-20T08:10:00Z',
            isRead: true,
          },
        ];
        
        // Імітація завантаження з API
        setTimeout(() => {
          setContacts(mockContacts);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
        setError('Помилка завантаження повідомлень. Спробуйте знову пізніше.');
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleMarkAsRead = (id: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, isRead: true } : contact
    ));
    if (selectedContact?.id === id) {
      setSelectedContact({ ...selectedContact, isRead: true });
    }
  };

  const handleDeleteContact = (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити це повідомлення?')) {
      setContacts(contacts.filter(contact => contact.id !== id));
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'all') return true;
    if (filter === 'read') return contact.isRead;
    if (filter === 'unread') return !contact.isRead;
    return true;
  });

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
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filter === 'all' 
                      ? 'bg-primary-100 text-primary-800 font-medium' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  Всі
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filter === 'unread' 
                      ? 'bg-primary-100 text-primary-800 font-medium' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  Непрочитані
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filter === 'read' 
                      ? 'bg-primary-100 text-primary-800 font-medium' 
                      : 'text-gray-500 hover:bg-gray-100'
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