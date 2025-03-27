'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// Компонент для елементів, що з'являються з анімацією при скролінгу
function AnimateOnScroll({ children, animation, delay = 0 }: { children: React.ReactNode, animation: string, delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${isVisible ? animation : 'opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

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

export default function GalleryPage() {
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

  // Отримуємо деталі обраного зображення
  const currentImage = selectedImage
    ? albumImages.find(img => img.id === selectedImage)
    : null;

  // Перехід до наступного або попереднього зображення
  const navigateImage = (direction: 'next' | 'prev') => {
    if (!selectedImage || !albumImages.length) return;
    
    const currentIndex = albumImages.findIndex(img => img.id === selectedImage);
    let nextIndex;
    
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % albumImages.length;
    } else {
      nextIndex = (currentIndex - 1 + albumImages.length) % albumImages.length;
    }
    
    setSelectedImage(albumImages[nextIndex].id);
  };

  return (
    <div className="space-y-12">
      {/* Заголовок сторінки */}
      <section className="text-center">
        <AnimateOnScroll animation="animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 text-primary-800">Галерея</h1>
          <p className="text-lg text-warmGray-600 max-w-2xl mx-auto">
            Перегляньте фотографії з наших паломницьких поїздок та відчуйте атмосферу святих місць
          </p>
        </AnimateOnScroll>
      </section>

      {/* Фільтри категорій */}
      <section>
        <AnimateOnScroll animation="animate-slide-in-up">
          <div className="flex justify-center flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-warmGray-100 text-warmGray-700 hover:bg-warmGray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </AnimateOnScroll>
      </section>

      {/* Сітка галерей */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGalleries.map((gallery, index) => (
            <AnimateOnScroll key={gallery.id} animation="animate-zoom-in" delay={index * 100}>
              <div
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedAlbum(gallery.id)}
              >
                <div className="aspect-[4/3] relative group">
                  <Image
                    src={gallery.coverImage}
                    alt={gallery.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
                      {gallery.category}
                    </span>
                    <span className="text-xs text-warmGray-500">{gallery.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-primary-800">{gallery.title}</h3>
                  <p className="text-sm text-warmGray-600 mb-4">{gallery.description}</p>
                  <div className="text-primary-600 text-sm font-medium flex items-center">
                    <span>Переглянути альбом</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Повідомлення, якщо немає результатів */}
        {filteredGalleries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-warmGray-600 text-lg">
              Немає галерей у цій категорії. Будь ласка, виберіть іншу категорію.
            </p>
          </div>
        )}
      </section>

      {/* Модальне вікно альбому */}
      {selectedAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in" onClick={() => setSelectedAlbum(null)}>
          <div 
            className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-primary-800">
                  {galleryData.find(g => g.id === selectedAlbum)?.title}
                </h3>
                <p className="text-warmGray-600">
                  {galleryData.find(g => g.id === selectedAlbum)?.description}
                </p>
              </div>
              <button 
                onClick={() => setSelectedAlbum(null)}
                className="text-warmGray-500 hover:text-warmGray-800 transition-colors"
                aria-label="Закрити"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {albumImages.map((image) => (
                <div 
                  key={image.id}
                  className="aspect-square relative rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage(image.id)}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <p className="text-white p-4">{image.alt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Модальне вікно зображення */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fade-in">
          <button 
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
            onClick={() => setSelectedImage(null)}
            aria-label="Закрити"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors z-10"
            onClick={() => navigateImage('prev')}
            aria-label="Попереднє зображення"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors z-10"
            onClick={() => navigateImage('next')}
            aria-label="Наступне зображення"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex flex-col">
            <div className="flex-grow relative">
              {currentImage && (
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            
            {currentImage && (
              <div className="bg-black/50 backdrop-blur-md p-4 text-white mt-auto">
                <p className="text-lg font-medium">{currentImage.alt}</p>
                {currentImage.caption && (
                  <p className="text-white/80 text-sm">{currentImage.caption}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 