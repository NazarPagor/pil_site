'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Gallery {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  imagesCount: number;
  createdAt: string;
}

export default function GalleryAdminPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setIsLoading(true);
        // У майбутньому замінити на реальний API-запит
        const mockGalleries: Gallery[] = [
          {
            id: '1',
            title: 'Проща до Зарваниці 2023',
            description: 'Фотографії з щорічної прощі до Зарваниці',
            coverImage: 'https://via.placeholder.com/300x200',
            imagesCount: 24,
            createdAt: '2023-07-20',
          },
          {
            id: '2',
            title: 'Різдвяна коляда',
            description: 'Різдвяні святкування у парафії',
            coverImage: 'https://via.placeholder.com/300x200',
            imagesCount: 15,
            createdAt: '2023-01-10',
          },
          {
            id: '3',
            title: 'Паломництво до Гошева',
            description: 'Фотографії з паломництва до Гошівського монастиря',
            coverImage: 'https://via.placeholder.com/300x200',
            imagesCount: 32,
            createdAt: '2023-08-15',
          },
        ];
        
        // Імітація завантаження з API
        setTimeout(() => {
          setGalleries(mockGalleries);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
        setError('Помилка завантаження галерей. Спробуйте знову пізніше.');
        setIsLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  const handleDeleteGallery = (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю галерею? Всі фотографії будуть видалені безповоротно.')) {
      setGalleries(galleries.filter(gallery => gallery.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
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
        <h1 className="text-2xl font-bold text-primary-800">Управління галереєю</h1>
        <Link
          href="/admin/gallery/new"
          className="px-4 py-2 bg-secondary-600 text-white rounded-md hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
        >
          Створити галерею
        </Link>
      </div>

      {galleries.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Галереї відсутні</h3>
          <p className="mt-1 text-sm text-gray-500">Почніть зі створення нової галереї.</p>
          <div className="mt-6">
            <Link
              href="/admin/gallery/new"
              className="inline-flex items-center px-4 py-2 bg-secondary-600 text-white rounded-md hover:bg-secondary-700"
            >
              <svg 
                className="-ml-1 mr-2 h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                />
              </svg>
              Створити галерею
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <div key={gallery.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                <Image
                  src={gallery.coverImage}
                  alt={gallery.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 p-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-white">
                      {gallery.imagesCount} фото
                    </span>
                    <span className="text-xs text-white">
                      {new Date(gallery.createdAt).toLocaleDateString('uk-UA')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 truncate">{gallery.title}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {gallery.description}
                </p>
                
                <div className="mt-4 flex justify-between items-center">
                  <Link
                    href={`/admin/gallery/${gallery.id}`}
                    className="text-sm font-medium text-secondary-600 hover:text-secondary-700"
                  >
                    Переглянути фото
                  </Link>
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/gallery/edit/${gallery.id}`}
                      className="p-1.5 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200"
                    >
                      <svg 
                        className="h-4 w-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDeleteGallery(gallery.id)}
                      className="p-1.5 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                    >
                      <svg 
                        className="h-4 w-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 