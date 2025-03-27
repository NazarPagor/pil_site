'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FormData {
  title: string;
  description: string;
  date: string;
  endDate: string;
  location: string;
  price: string;
  image: File | null;
}

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    date: '',
    endDate: '',
    location: '',
    price: '',
    image: null,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        // В майбутньому замінити на реальний API-запит
        
        // Імітація отримання даних з API
        setTimeout(() => {
          // Припустимо, що ці дані приходять з сервера
          const eventData = {
            title: 'Паломництво до Зарваниці',
            description: 'Традиційне паломництво до Марійського духовного центру в Зарваниці - одного з найвідоміших місць паломництва греко-католиків в Україні.',
            date: '2023-06-15',
            endDate: '2023-06-17',
            location: 'Зарваниця, Тернопільська область',
            price: '800 грн',
            imageUrl: 'https://via.placeholder.com/300x200',
          };
          
          setFormData({
            title: eventData.title,
            description: eventData.description,
            date: eventData.date,
            endDate: eventData.endDate || '',
            location: eventData.location,
            price: eventData.price || '',
            image: null,
          });
          
          setImagePreview(eventData.imageUrl);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
        setError('Помилка завантаження даних про захід. Спробуйте знову пізніше.');
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Валідація форми
      if (!formData.title || !formData.description || !formData.date || !formData.location) {
        throw new Error('Будь ласка, заповніть всі обов\'язкові поля');
      }

      // Тут буде реальний API-запит у майбутньому
      console.log('Форма оновлення відправлена:', formData);
      
      // Імітація відправки запиту
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Перенаправлення на сторінку заходів
      router.push('/admin/events');
    } catch (error) {
      console.error('Помилка відправки форми:', error);
      setError(error instanceof Error ? error.message : 'Виникла помилка при оновленні заходу');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-800">Редагування заходу</h1>
        <Link 
          href="/admin/events" 
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

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Назва заходу *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Місце проведення *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Дата початку *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Дата завершення
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Вартість
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Наприклад: 500 грн або Безкоштовно"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Зображення
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Превью" className="h-32 object-cover rounded-md" />
                <p className="text-xs text-gray-500 mt-1">
                  Поточне зображення. Завантажте нове, щоб замінити.
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Опис заходу *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3">
          <Link
            href="/admin/events"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Скасувати
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Збереження...' : 'Зберегти зміни'}
          </button>
        </div>
      </form>
    </div>
  );
} 