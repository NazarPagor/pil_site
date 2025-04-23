'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AnimateOnScroll from '../AnimateOnScroll';

interface GalleryImage {
  id: string;
  url: string;
  alt?: string;
}

interface Gallery {
  id: string;
  title: string;
  description?: string;
  coverImage: string;
  images: GalleryImage[];
  createdAt: string;
}

export default function GalleryPageContent() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'mosaic'>('mosaic');

  // Завантаження галерей з API
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
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
        setError('Не вдалося завантажити галереї. Спробуйте знову пізніше.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  // Обробник для закриття модальних вікон при кліку на Escape
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedImage) {
          setSelectedImage(null);
        } else if (selectedAlbum) {
          setSelectedAlbum(null);
        }
      }
    };

    // Обробник для навігації клавішами
    const handleKeyNavigation = (e: KeyboardEvent) => {
      if (!selectedAlbum || !selectedGallery) return;

      if (e.key === 'ArrowRight') {
        navigateImage('next');
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    window.addEventListener('keydown', handleKeyNavigation);
    
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
      window.removeEventListener('keydown', handleKeyNavigation);
    };
  }, [selectedAlbum, selectedImage]);

  // Отримуємо обрану галерею і її зображення
  const selectedGallery = selectedAlbum 
    ? galleries.find(gallery => gallery.id === selectedAlbum) 
    : null;

  // Функція для навігації між зображеннями
  const navigateImage = (direction: 'next' | 'prev') => {
    if (!selectedGallery || !selectedGallery.images.length) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % selectedGallery.images.length);
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedGallery.images.length - 1 : prev - 1
      );
    }
  };

  // Створення мозаїчної структури для зображень
  const createMosaicLayout = (images: GalleryImage[]) => {
    if (!images || images.length === 0) return [];
    
    interface MosaicItem {
      image: GalleryImage;
      width: number;
    }
    
    const result: MosaicItem[][] = [];
    let row: MosaicItem[] = [];
    let currentRowWidth = 0;
    const targetRowWidth = 100; // відсотки
    
    // Розрахунок випадкової ширини для різноманіття сітки
    const getRandomWidth = () => Math.floor(Math.random() * 30) + 25; // від 25 до 55
    
    for (let i = 0; i < images.length; i++) {
      const imageWidth = getRandomWidth();
      
      if (currentRowWidth + imageWidth <= targetRowWidth) {
        row.push({ image: images[i], width: imageWidth });
        currentRowWidth += imageWidth;
      } else {
        // Якщо ряд заповнено, нормалізуємо ширину і починаємо новий ряд
        const normalizeFactor = targetRowWidth / currentRowWidth;
        row = row.map(item => ({
          ...item,
          width: Math.floor(item.width * normalizeFactor)
        }));
        
        result.push(row);
        row = [{ image: images[i], width: imageWidth }];
        currentRowWidth = imageWidth;
      }
    }
    
    // Додаємо останній ряд, якщо він не порожній
    if (row.length > 0) {
      const normalizeFactor = targetRowWidth / currentRowWidth;
      row = row.map(item => ({
        ...item,
        width: Math.floor(item.width * normalizeFactor)
      }));
      result.push(row);
    }
    
    return result;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
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
      </div>
    );
  }

  // Створення мозаїчної структури для вибраної галереї
  const mosaicLayout = selectedGallery ? createMosaicLayout(selectedGallery.images) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок сторінки */}
      <AnimateOnScroll animation="animate-fade-in">
        <h1 className="text-4xl font-bold text-center mb-4 text-primary-800">Фотогалерея</h1>
        <p className="text-center text-warmGray-600 mb-8 max-w-3xl mx-auto">
          Перегляньте фотографії з наших паломницьких поїздок до святих місць України та світу
        </p>
      </AnimateOnScroll>

      {/* Галереї */}
      {galleries.length === 0 ? (
        <div className="text-center py-12">
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
          <h3 className="mt-2 text-lg font-medium text-gray-900">Галереї відсутні</h3>
          <p className="mt-1 text-gray-500">Наразі в галереї немає фотографій.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleries.map((gallery, index) => (
            <AnimateOnScroll key={gallery.id} animation="animate-zoom-in" delay={index * 100}>
              <div
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
                onClick={() => {
                  setSelectedAlbum(gallery.id);
                  setCurrentImageIndex(0);
                }}
              >
                <div className="relative h-64">
                  <Image
                    src={gallery.coverImage}
                    alt={gallery.title}
                    fill
                    className="object-cover transition-transform hover:scale-105 duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-xl font-bold mb-1">{gallery.title}</h2>
                    <p className="text-sm text-white/80">{new Date(gallery.createdAt).toLocaleDateString('uk-UA')}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-warmGray-600 line-clamp-2">{gallery.description}</p>
                  <div className="flex justify-end items-center mt-4">
                    <span className="text-sm text-warmGray-500">
                      {gallery.images.length} фото
                    </span>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      )}

      {/* Модальне вікно перегляду альбому */}
      {selectedAlbum && selectedGallery && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col overflow-hidden">
          <div className="bg-white/10 backdrop-blur-sm py-4 px-6 mb-4">
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedGallery.title}</h2>
                {selectedGallery.description && (
                  <p className="text-white/80 mt-1 max-w-2xl">{selectedGallery.description}</p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-white/20 rounded-full p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-full ${viewMode === 'grid' ? 'bg-white/50 text-black' : 'text-white'}`}
                    title="Сітка"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('mosaic')}
                    className={`p-2 rounded-full ${viewMode === 'mosaic' ? 'bg-white/50 text-black' : 'text-white'}`}
                    title="Мозаїка"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => setSelectedAlbum(null)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto px-6 pb-8">
            <div className="container mx-auto">
              {selectedGallery.images.length === 0 ? (
                <p className="text-center py-8 text-white/80">У цьому альбомі поки немає фотографій</p>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {selectedGallery.images.map((image, index) => (
                    <div
                      key={image.id}
                      className="relative aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-90 group transition-transform hover:scale-105 duration-300"
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setSelectedImage(image.url);
                      }}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt || `Зображення ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all">
                        <svg 
                          className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" 
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {mosaicLayout.map((row, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="flex w-full" style={{ height: '250px' }}>
                      {row.map((item, colIndex) => (
                        <div
                          key={`cell-${rowIndex}-${colIndex}`}
                          className="relative mx-1 overflow-hidden rounded-md cursor-pointer transition-transform hover:scale-105 duration-300"
                          style={{ width: `${item.width}%` }}
                          onClick={() => {
                            const imageIndex = selectedGallery.images.findIndex(img => img.id === item.image.id);
                            if (imageIndex !== -1) {
                              setCurrentImageIndex(imageIndex);
                              setSelectedImage(item.image.url);
                            }
                          }}
                        >
                          <Image
                            src={item.image.url}
                            alt={item.image.alt || `Зображення`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
                            <svg 
                              className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" 
                              />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Покращений лайтбокс для перегляду фотографій */}
      {selectedAlbum && selectedGallery && selectedImage && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <div className="absolute top-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-4 flex justify-between items-center z-10">
            <div className="text-white">
              <span className="text-lg font-medium">
                {currentImageIndex + 1} / {selectedGallery.images.length}
              </span>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="text-white p-2 rounded-full hover:bg-white/20"
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center p-10">
              <Image
                src={selectedGallery.images[currentImageIndex].url}
                alt={selectedGallery.images[currentImageIndex].alt || `Зображення ${currentImageIndex + 1}`}
                fill
                className="object-contain"
              />
              {selectedGallery.images[currentImageIndex].alt && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-sm max-w-md text-center">
                  {selectedGallery.images[currentImageIndex].alt}
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={() => navigateImage('prev')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-4 rounded-full bg-black/30 hover:bg-black/50 transition-colors z-10"
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => navigateImage('next')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-4 rounded-full bg-black/30 hover:bg-black/50 transition-colors z-10"
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Мініатюри знизу */}
          <div className="absolute bottom-0 left-0 right-0 overflow-x-auto bg-black/50 backdrop-blur-sm py-2 z-10">
            <div className="flex space-x-2 px-4">
              {selectedGallery.images.map((image, index) => (
                <div 
                  key={image.id} 
                  className={`relative h-16 w-16 flex-shrink-0 cursor-pointer transition-transform hover:scale-110 duration-300 ${index === currentImageIndex ? 'ring-2 ring-white' : 'opacity-70'}`}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setSelectedImage(image.url);
                  }}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `Мініатюра ${index + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 