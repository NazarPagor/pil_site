'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

interface GalleryData {
  title: string;
  description: string;
  coverImage: File | null;
  images: GalleryImage[];
}

export default function EditGalleryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  
  const [gallery, setGallery] = useState<GalleryData>({
    title: '',
    description: '',
    coverImage: null,
    images: [],
  });

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setIsLoading(true);
        // В майбутньому замінити на реальний API-запит
        
        // Імітація отримання даних з API
        setTimeout(() => {
          // Припустимо, що ці дані приходять з сервера
          const galleryData = {
            title: 'Проща до Зарваниці 2023',
            description: 'Фотографії з щорічної прощі до Зарваниці - одного з найбільших місць паломництва в Україні.',
            coverImageUrl: 'https://via.placeholder.com/300x200',
            images: [
              { id: '1', url: 'https://via.placeholder.com/800x600?text=Image1', alt: 'Паломники біля каплиці' },
              { id: '2', url: 'https://via.placeholder.com/800x600?text=Image2', alt: 'Служба Божа' },
              { id: '3', url: 'https://via.placeholder.com/800x600?text=Image3', alt: 'Спільна молитва' },
              { id: '4', url: 'https://via.placeholder.com/800x600?text=Image4', alt: 'Вечірнє богослужіння' },
            ],
          };
          
          setGallery({
            title: galleryData.title,
            description: galleryData.description,
            coverImage: null,
            images: galleryData.images,
          });
          
          setCoverImagePreview(galleryData.coverImageUrl);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
        setError('Помилка завантаження даних про галерею. Спробуйте знову пізніше.');
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGallery(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setGallery(prev => ({ ...prev, coverImage: file }));
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...filesArray]);
      
      // Create previews
      const newPreviews: string[] = [];
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === filesArray.length) {
            setNewImagePreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveExistingImage = (imageId: string) => {
    setGallery(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Валідація форми
      if (!gallery.title || !gallery.description) {
        throw new Error('Будь ласка, заповніть всі обов\'язкові поля');
      }

      // Тут буде реальний API-запит у майбутньому
      console.log('Дані галереї для оновлення:', {
        ...gallery,
        newImages: newImages,
      });
      
      // Імітація відправки запиту
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Перенаправлення на сторінку галерей
      router.push('/admin/gallery');
    } catch (error) {
      console.error('Помилка відправки форми:', error);
      setError(error instanceof Error ? error.message : 'Виникла помилка при оновленні галереї');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-800">Редагування галереї</h1>
        <Link 
          href="/admin/gallery" 
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
        >
          Повернутися до списку
        </Link>
      </div>

      {error && (
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
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-8">
        {/* Основна інформація */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Основна інформація</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Назва галереї *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={gallery.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Опис галереї *
              </label>
              <textarea
                id="description"
                name="description"
                value={gallery.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                required
              ></textarea>
            </div>

            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
                Обкладинка галереї
              </label>
              <input
                type="file"
                id="coverImage"
                name="coverImage"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="w-full"
              />
              {coverImagePreview && (
                <div className="mt-2">
                  <img src={coverImagePreview} alt="Обкладинка галереї" className="h-40 object-cover rounded-md" />
                  <p className="text-xs text-gray-500 mt-1">
                    Поточне зображення обкладинки. Завантажте нове, щоб замінити.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Управління існуючими зображеннями */}
        <div className="space-y-6 pt-6 border-t">
          <h2 className="text-lg font-medium text-gray-900">Управління зображеннями</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.images.map(image => (
              <div key={image.id} className="group relative">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={300}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(image.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <p className="mt-1 text-xs text-gray-500 truncate">{image.alt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Додавання нових зображень */}
        <div className="space-y-6 pt-6 border-t">
          <h2 className="text-lg font-medium text-gray-900">Додати нові зображення</h2>
          
          <div>
            <label htmlFor="newImages" className="block text-sm font-medium text-gray-700 mb-1">
              Завантажити зображення
            </label>
            <input
              type="file"
              id="newImages"
              name="newImages"
              accept="image/*"
              multiple
              onChange={handleNewImagesChange}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ви можете вибрати декілька файлів одночасно.
            </p>
          </div>

          {newImagePreviews.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Нові зображення для завантаження:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {newImagePreviews.map((preview, index) => (
                  <div key={index} className="group relative">
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
                      <img src={preview} alt={`New upload ${index + 1}`} className="object-cover w-full h-full" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Link
            href="/admin/gallery"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Скасувати
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-secondary-600 text-white rounded-md hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Збереження...' : 'Зберегти зміни'}
          </button>
        </div>
      </form>
    </div>
  );
} 