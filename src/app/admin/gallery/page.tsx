'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Image {
  id: string;
  url: string;
  alt?: string;
}

interface Gallery {
  id: string;
  title: string;
  description?: string;
  coverImage: string;
  images: Image[];
  createdAt: string;
}

export default function GalleryAdminPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGalleryId, setExpandedGalleryId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/galleries');
        
        if (!response.ok) {
          throw new Error('Не вдалося завантажити галереї');
        }
        
        const data = await response.json();
        setGalleries(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
        setError('Помилка завантаження галерей. Спробуйте знову пізніше.');
        setIsLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  const handleDeleteGallery = async (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю галерею? Всі фотографії будуть видалені безповоротно.')) {
      try {
        setDeleteLoading(id);
        const response = await fetch(`/api/galleries/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Не вдалося видалити галерею');
        }
        
        setGalleries(galleries.filter(gallery => gallery.id !== id));
      } catch (error) {
        console.error('Помилка видалення галереї:', error);
        alert('Не вдалося видалити галерею. Спробуйте знову пізніше.');
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  // Фільтрація галерей за пошуковим запитом
  const filteredGalleries = galleries.filter(gallery => 
    gallery.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (gallery.description && gallery.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleExpandGallery = (id: string) => {
    setExpandedGalleryId(expandedGalleryId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-secondary-600"></div>
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

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Управління галереєю</h1>
        <Link
          href="/admin/gallery/new"
          className="px-4 py-2 bg-secondary-600 text-white rounded-md hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-colors flex items-center"
        >
          <svg 
            className="mr-2 h-5 w-5" 
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

      {/* Панель пошуку і фільтрації */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Пошук галерей..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
          <div>
            Знайдено галерей: <span className="font-medium">{filteredGalleries.length}</span>
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-primary-600 hover:text-primary-800"
            >
              Очистити фільтр
            </button>
          )}
        </div>
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
                  Створено
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Зображень
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGalleries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Немає галерей для відображення
                  </td>
                </tr>
              ) : (
                filteredGalleries.map((gallery) => (
                  <tr key={gallery.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {gallery.coverImage && (
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={gallery.coverImage}
                              alt={gallery.title}
                            />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{gallery.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{gallery.description || 'Опис відсутній'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(gallery.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{gallery.images.length}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/gallery/${gallery.id}`}
                          className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-md text-xs font-medium hover:bg-indigo-200"
                        >
                          Редагувати
                        </Link>
                        <button
                          onClick={() => handleDeleteGallery(gallery.id)}
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
        {filteredGalleries.length === 0 ? (
          <div className="bg-white p-4 rounded-lg text-center text-gray-500">
            Немає галерей для відображення
          </div>
        ) : (
          filteredGalleries.map((gallery) => (
            <div key={gallery.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {gallery.coverImage && (
                      <img
                        className="h-12 w-12 rounded-md object-cover"
                        src={gallery.coverImage}
                        alt={gallery.title}
                      />
                    )}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 truncate max-w-[140px]">{gallery.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(gallery.createdAt)} • {gallery.images.length} зображень
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleExpandGallery(gallery.id)}
                    className="text-gray-500 p-1"
                  >
                    <svg className={`w-5 h-5 transform transition-transform ${expandedGalleryId === gallery.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {expandedGalleryId === gallery.id && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-xs font-medium text-gray-500">Опис:</span>
                      <p className="text-sm text-gray-700 mt-1">{gallery.description || 'Опис відсутній'}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/admin/gallery/${gallery.id}`}
                        className="flex-1 px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-md text-xs font-medium hover:bg-indigo-200 text-center"
                      >
                        Редагувати
                      </Link>
                      <button
                        onClick={() => handleDeleteGallery(gallery.id)}
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