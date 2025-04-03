'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

type EventGalleryProps = {
  images: string[];
  eventTitle: string;
};

const EventGallery: React.FC<EventGalleryProps> = ({ images, eventTitle }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Обробник клавіш
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          closeLightbox();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  // Якщо немає зображень, показуємо повідомлення
  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Галерея для цієї поїздки поки не доступна</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-primary-900 mb-4">Галерея</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div 
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image}
              alt={`${eventTitle} - зображення ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Лайтбокс для перегляду зображень */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
          
          <button
            onClick={goToPrevious}
            className="absolute left-4 bg-black bg-opacity-50 text-white p-2 rounded-full"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          
          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={images[currentImageIndex]}
              alt={`${eventTitle} - зображення ${currentImageIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>
          
          <button
            onClick={goToNext}
            className="absolute right-4 bg-black bg-opacity-50 text-white p-2 rounded-full"
          >
            <ArrowRightIcon className="h-6 w-6" />
          </button>
          
          <div className="absolute bottom-4 text-white bg-black bg-opacity-50 py-1 px-3 rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventGallery; 