'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Page {
  id: string;
  title: string;
  slug: string;
  description: string;
  lastUpdated: string;
  isSystem: boolean;
}

export default function PagesAdminPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setIsLoading(true);
        // У майбутньому замінити на реальний API-запит
        const mockPages: Page[] = [
          {
            id: '1',
            title: 'Головна сторінка',
            slug: '',
            description: 'Головна сторінка сайту паломницького центру',
            lastUpdated: '2023-10-05',
            isSystem: true,
          },
          {
            id: '2',
            title: 'Про нас',
            slug: 'about',
            description: 'Інформація про паломницький центр, наша місія та цінності',
            lastUpdated: '2023-10-05',
            isSystem: true,
          },
          {
            id: '3',
            title: 'Заходи',
            slug: 'events',
            description: 'Сторінка із списком заходів та паломництв',
            lastUpdated: '2023-09-15',
            isSystem: true,
          },
          {
            id: '4',
            title: 'Галерея',
            slug: 'gallery',
            description: 'Фотогалерея з паломницьких подорожей',
            lastUpdated: '2023-09-10',
            isSystem: true,
          },
          {
            id: '5',
            title: 'Контакти',
            slug: 'contacts',
            description: 'Контактна інформація та форма зворотного зв\'язку',
            lastUpdated: '2023-10-12',
            isSystem: true,
          },
          {
            id: '6',
            title: 'Правила паломництва',
            slug: 'rules',
            description: 'Важлива інформація для паломників: правила поведінки та рекомендації',
            lastUpdated: '2023-09-15',
            isSystem: false,
          },
          {
            id: '7',
            title: 'Часті запитання',
            slug: 'faq',
            description: 'Відповіді на поширені запитання про паломництва',
            lastUpdated: '2023-09-10',
            isSystem: false,
          },
        ];
        
        // Імітація завантаження з API
        setTimeout(() => {
          setPages(mockPages);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
        setError('Помилка завантаження сторінок. Спробуйте знову пізніше.');
        setIsLoading(false);
      }
    };

    fetchPages();
  }, []);

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
        <h1 className="text-2xl font-bold text-primary-800">Управління сторінками</h1>
        <p className="mt-1 text-sm text-gray-500">
          Редагуйте контент сторінок вашого сайту
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Назва
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Оновлено
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{page.title}</div>
                        <div className="text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{page.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">/{page.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {new Date(page.lastUpdated).toLocaleDateString('uk-UA')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${page.isSystem ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                    >
                      {page.isSystem ? 'Системна' : 'Користувацька'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/${page.slug}`}
                        target="_blank"
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium hover:bg-blue-200"
                      >
                        Переглянути
                      </Link>
                      <Link
                        href={`/admin/pages/edit/${page.id}`}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md text-xs font-medium hover:bg-indigo-200"
                      >
                        Редагувати
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 