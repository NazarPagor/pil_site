'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import AnimateOnScroll from '../AnimateOnScroll';

// Дані галерей
const galleryData = [
  {
    id: '1',
    title: 'Паломництво до Святої Землі',
    description: 'Фотографії з подорожі до святих місць Ізраїлю та Палестини',
    coverImage: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=2070&auto=format&fit=crop',
    category: 'Свята Земля',
    date: 'Березень 2023',
    images: [
      {
        id: '1-1',
        url: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=2070&auto=format&fit=crop',
        alt: 'Стіна Плачу, Єрусалим',
        caption: 'Стіна Плачу - найсвятіше місце для юдеїв',
      },
      {
        id: '1-2',
        url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=1998&auto=format&fit=crop',
        alt: 'Храм Гробу Господнього',
        caption: 'Храм Гробу Господнього - головна християниська святиня',
      },
      {
        id: '1-3',
        url: 'https://images.unsplash.com/photo-1565177605526-966ae62c01a3?q=80&w=1974&auto=format&fit=crop',
        alt: 'Мечеть Аль-Акса',
        caption: 'Мечеть Аль-Акса - третя за значимістю ісламська святиня',
      },
      {
        id: '1-4',
        url: 'https://images.unsplash.com/photo-1531152127291-ea62c7180f04?q=80&w=1978&auto=format&fit=crop',
        alt: 'Віфлеєм',
        caption: 'Церква Різдва Христового у Віфлеємі',
      },
      {
        id: '1-5',
        url: 'https://images.unsplash.com/photo-1549877452-9c68f96c2a9f?q=80&w=2068&auto=format&fit=crop',
        alt: 'Галілейське море',
        caption: 'Галілейське море - місце де Ісус ходив по воді',
      },
      {
        id: '1-6',
        url: 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?q=80&w=2070&auto=format&fit=crop',
        alt: 'Голгофа',
        caption: 'Голгофа - місце розп\'яття Ісуса Христа',
      },
    ],
  },
  {
    id: '2',
    title: 'Паломництво до Святої Гори Афон',
    description: 'Фотографії з поїздки до монастирів Афону в Греції',
    coverImage: 'https://images.unsplash.com/photo-1607325294707-11329f84c363?q=80&w=1974&auto=format&fit=crop',
    category: 'Афон',
    date: 'Травень 2023',
    images: [
      {
        id: '2-1',
        url: 'https://images.unsplash.com/photo-1607325294707-11329f84c363?q=80&w=1974&auto=format&fit=crop',
        alt: 'Монастир Ватопед',
        caption: 'Монастир Ватопед - один з найбільших монастирів Афону',
      },
      {
        id: '2-2',
        url: 'https://images.unsplash.com/photo-1541777703-24e3c343b44f?q=80&w=1974&auto=format&fit=crop',
        alt: 'Монастир Хіландар',
        caption: 'Сербський монастир Хіландар',
      },
      {
        id: '2-3',
        url: 'https://images.unsplash.com/photo-1629461866292-cda3ebd4ff58?q=80&w=1996&auto=format&fit=crop',
        alt: 'Монастир Пантократор',
        caption: 'Вид на монастир Пантократор',
      },
      {
        id: '2-4',
        url: 'https://images.unsplash.com/photo-1555624517-3576b0bd44c9?q=80&w=1925&auto=format&fit=crop',
        alt: 'Шлях до монастиря',
        caption: 'Мальовничий шлях до монастиря',
      },
    ],
  },
  {
    id: '3',
    title: 'Паломництво до Почаївської лаври',
    description: 'Фотографії з візиту до однієї з найбільших православних святинь України',
    coverImage: 'https://images.unsplash.com/photo-1520516415634-947297ba99ff?q=80&w=1944&auto=format&fit=crop',
    category: 'Україна',
    date: 'Серпень 2023',
    images: [
      {
        id: '3-1',
        url: 'https://images.unsplash.com/photo-1520516415634-947297ba99ff?q=80&w=1944&auto=format&fit=crop',
        alt: 'Почаївська лавра',
        caption: 'Зовнішній вигляд Почаївської лаври',
      },
      {
        id: '3-2',
        url: 'https://images.unsplash.com/photo-1542547958-89e2c0c5a843?q=80&w=1974&auto=format&fit=crop',
        alt: 'Внутрішній двір',
        caption: 'Внутрішній двір монастиря',
      },
      {
        id: '3-3',
        url: 'https://images.unsplash.com/photo-1583752699429-af12e5113365?q=80&w=1974&auto=format&fit=crop',
        alt: 'Святе джерело',
        caption: 'Святе джерело на території лаври',
      },
    ],
  },
];

// Категорії для фільтрації
const categories = [
  { id: 'all', name: 'Всі' },
  { id: 'svjata-zemlja', name: 'Свята Земля' },
  { id: 'afon', name: 'Афон' },
  { id: 'ukraine', name: 'Україна' },
];

export default function GalleryPageContent() {
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

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

    window.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [selectedAlbum, selectedImage]);

  // Фільтруємо галереї за категорією
  const filteredGalleries = activeCategory === 'all'
    ? galleryData
    : galleryData.filter(gallery => 
        gallery.category.toLowerCase().replace(/\s+/g, '-') === activeCategory
      );

  // Отримуємо зображення для обраного альбому
  const albumImages = selectedAlbum
    ? galleryData.find(gallery => gallery.id === selectedAlbum)?.images || []
    : [];

  // Функція для навігації між зображеннями
  const navigateImage = (direction: 'next' | 'prev') => {
    if (!selectedImage || !selectedAlbum) return;
    
    const currentIndex = albumImages.findIndex(img => img.id === selectedImage);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % albumImages.length;
    } else {
      newIndex = (currentIndex - 1 + albumImages.length) % albumImages.length;
    }
    
    setSelectedImage(albumImages[newIndex].id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок сторінки */}
      <AnimateOnScroll animation="animate-fade-in">
        <h1 className="text-4xl font-bold text-center mb-4 text-primary-800">Фотогалерея</h1>
        <p className="text-center text-warmGray-600 mb-8 max-w-3xl mx-auto">
          Перегляньте фотографії з наших паломницьких поїздок до святих місць України та світу
        </p>
      </AnimateOnScroll>

      {/* Фільтрація за категоріями */}
      <div className="flex flex-wrap justify-center mb-12 gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeCategory === category.id
                ? 'bg-primary-600 text-white'
                : 'bg-warmGray-100 text-warmGray-700 hover:bg-warmGray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Галереї */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGalleries.map((gallery, index) => (
          <AnimateOnScroll key={gallery.id} animation="animate-zoom-in" delay={index * 100}>
            <div
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedAlbum(gallery.id)}
            >
              <div className="relative h-64">
                <Image
                  src={gallery.coverImage}
                  alt={gallery.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-xl font-bold mb-1">{gallery.title}</h2>
                  <p className="text-sm text-white/80">{gallery.date}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-warmGray-600">{gallery.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="inline-block bg-warmGray-100 text-warmGray-600 text-xs px-2 py-1 rounded-full">
                    {gallery.category}
                  </span>
                  <span className="text-sm text-warmGray-500">
                    {gallery.images.length} фото
                  </span>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        ))}
      </div>

      {/* Модальне вікно альбому */}
      {selectedAlbum && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary-800">
                    {galleryData.find(g => g.id === selectedAlbum)?.title}
                  </h2>
                  <p className="text-warmGray-600">
                    {galleryData.find(g => g.id === selectedAlbum)?.date} - 
                    {galleryData.find(g => g.id === selectedAlbum)?.category}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAlbum(null)}
                  className="text-warmGray-500 hover:text-warmGray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {albumImages.map(image => (
                  <div
                    key={image.id}
                    className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(image.id);
                    }}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-sm font-medium">{image.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальне вікно зображення */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedImage(null);
          }}
        >
          <button 
            className="absolute top-4 right-4 text-white opacity-70 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white opacity-70 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white opacity-70 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
            }}
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <div 
            className="relative max-w-7xl max-h-[80vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[70vh]">
              {albumImages.find(img => img.id === selectedImage) && (
                <Image
                  src={albumImages.find(img => img.id === selectedImage)?.url || ''}
                  alt={albumImages.find(img => img.id === selectedImage)?.alt || ''}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <div className="mt-4 bg-black/50 p-4 rounded-lg">
              <p className="text-white font-medium">
                {albumImages.find(img => img.id === selectedImage)?.alt}
              </p>
              <p className="text-white/80 text-sm mt-1">
                {albumImages.find(img => img.id === selectedImage)?.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 