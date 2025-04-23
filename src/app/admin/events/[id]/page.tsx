'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ScheduleEditor from '@/components/admin/ScheduleEditor';


interface FormData {
  title: string;
  description: string;
  longDescription: string;
  startDate: string;
  endDate: string;
  location: string;
  locationDescription: string;
  price: string;
  currency: string;
  duration: string;
  image: File | null;
  galleryImages: string[];
  difficulty: string;
  includes: string;
  notIncluded: string;
  documentsRequired: string;
  status: string;
  schedule: Array<{
    day: number;
    title: string;
    activities: string[];
  }>;
}

export default function EventEditRedirect({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const eventId =  params.id;
  



  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    longDescription: '',
    startDate: '',
    endDate: '',
    location: '',
    locationDescription: '',
    price: '',
    currency: 'UAH',
    duration: '',
    image: null,
    galleryImages: [],
    difficulty: 'medium',
    includes: '',
    notIncluded: '',
    documentsRequired: '',
    status: 'active', // За замовчуванням активний
    schedule: [{ day: 1, title: 'День 1', activities: [''] }]
  });

  // Отримання даних для редагування
  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/events/${eventId}`);
          
          if (!response.ok) {
            throw new Error('Не вдалося отримати дані події');
          }
          
          const eventData = await response.json();
          
          // Форматування дат для полів введення (формат YYYY-MM-DD)
          const formatDateForInput = (dateString: string) => {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
          };
          
          setFormData({
            title: eventData.title,
            description: eventData.description,
            longDescription: eventData.longDescription || '',
            startDate: formatDateForInput(eventData.startDate),
            endDate: eventData.endDate ? formatDateForInput(eventData.endDate) : '',
            location: eventData.location,
            locationDescription: eventData.locationDescription || '',
            price: eventData.price.toString(),
            currency: eventData.currency || 'UAH',
            duration: eventData.duration || '',
            image: null,
            galleryImages: eventData.galleryImages || [],
            difficulty: eventData.difficulty || 'medium',
            includes: eventData.includes?.join(', ') || '',
            notIncluded: eventData.notIncluded?.join(', ') || '',
            documentsRequired: eventData.documentsRequired?.join(', ') || '',
            status: eventData.status || 'active',
            schedule: eventData.scheduleData || [{ day: 1, title: 'День 1', activities: [''] }]
          });
          
          setImagePreview(eventData.image);
          setIsLoading(false);
        } catch (error) {
          console.error('Помилка завантаження даних:', error);
          setError('Помилка завантаження даних про подію. Спробуйте ще раз пізніше.');
          setIsLoading(false);
        }
      };

      fetchEvent();
    }
  }, [eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, image: file }));
      
      // Створення превью
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
      // Валідація
      if (!formData.title || !formData.description || !formData.startDate || !formData.location) {
        throw new Error('Будь ласка, заповніть всі обов\'язкові поля');
      }

      // Форматування даних для API
      const eventData: any = {
        title: formData.title,
        description: formData.description,
        longDescription: formData.longDescription,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : new Date(formData.startDate).toISOString(),
        location: formData.location,
        locationDescription: formData.locationDescription,
        price: parseInt(formData.price) || 0,
        currency: formData.currency,
        duration: formData.duration,
        difficulty: formData.difficulty,
        status: formData.status,
        includes: formData.includes.split(',').map(item => item.trim()).filter(item => item),
        notIncluded: formData.notIncluded.split(',').map(item => item.trim()).filter(item => item),
        documentsRequired: formData.documentsRequired.split(',').map(item => item.trim()).filter(item => item),
        galleryImages: formData.galleryImages,
        scheduleData: formData.schedule.filter(day => day.activities.some(activity => activity.trim() !== '')),
      };

      // Додаємо зображення, якщо воно було вибране
      if (imagePreview) {
        eventData.image = imagePreview;
      }

      // Відправляємо дані на API
      const url = `/api/events/${eventId}`;
      const method =  'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        throw new Error('Помилка при збереженні події');
      }
      
      // Перенаправлення на сторінку зі списком подій
      router.push('/admin/events');
    } catch (error: any) {
      console.error('Помилка при збереженні:', error);
      setError(error.message || 'Помилка при збереженні даних. Спробуйте ще раз пізніше.');
      setIsSubmitting(false);
    }
  };

  const updateSchedule = (newSchedule: typeof formData.schedule) => {
    setFormData(prev => ({ ...prev, schedule: newSchedule }));
  };

  const addGalleryImage = () => {
    setFormData(prev => ({
      ...prev,
      galleryImages: [...prev.galleryImages, '']
    }));
  };

  const updateGalleryImage = (index: number, value: string) => {
    const newGalleryImages = [...formData.galleryImages];
    newGalleryImages[index] = value;
    setFormData(prev => ({ ...prev, galleryImages: newGalleryImages }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-primary-800">Редагування поїздки</h1>
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

    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        {/* Основна інформація */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-700 border-b pb-2">Основна інформація</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Назва події *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Дата початку *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Тривалість (наприклад: "7 днів") *
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="наприклад: 7 днів"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Вартість *
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Наприклад: 500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                  required
                />
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                >
                  <option value="UAH">₴ UAH</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                Складність
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
              >
                <option value="easy">Легка</option>
                <option value="medium">Середня</option>
                <option value="hard">Важка</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Статус
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
              >
                <option value="active">Активний</option>
                <option value="inactive">Неактивний</option>
                <option value="completed">Завершений</option>
              </select>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Основне зображення
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
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Короткий опис події *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                required
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Короткий опис, який відображатиметься в списку подій</p>
            </div>
          </div>
        </div>

        {/* Деталі */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-700 border-b pb-2">Деталі</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Детальний опис події
                </label>
                <textarea
                  id="longDescription"
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Можна використовувати HTML-теги (p, ul, li, strong, em тощо)</p>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="locationDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Опис місця проведення
                </label>
                <textarea
                  id="locationDescription"
                  name="locationDescription"
                  value={formData.locationDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                ></textarea>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Що включено / не включено у вартість</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="includes" className="block text-sm font-medium text-gray-700 mb-1">
                    Що включено (розділіть комою)
                  </label>
                  <textarea
                    id="includes"
                    name="includes"
                    value={formData.includes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Наприклад: проживання, харчування, трансфер"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="notIncluded" className="block text-sm font-medium text-gray-700 mb-1">
                    Що не включено (розділіть комою)
                  </label>
                  <textarea
                    id="notIncluded"
                    name="notIncluded"
                    value={formData.notIncluded}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Наприклад: особисті витрати, сувеніри"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Необхідні документи</h3>
              
              <div>
                <label htmlFor="documentsRequired" className="block text-sm font-medium text-gray-700 mb-1">
                  Необхідні документи (розділіть комою)
                </label>
                <textarea
                  id="documentsRequired"
                  name="documentsRequired"
                  value={formData.documentsRequired}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Наприклад: Закордонний паспорт, медична страховка"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Програма */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-700 border-b pb-2">Програма поїздки</h2>
          <p className="text-sm text-gray-600 mb-4">
            Додайте детальну програму поїздки по днях. Для кожного дня вкажіть заголовок і список активностей.
          </p>
          
          <ScheduleEditor schedule={formData.schedule} onChange={updateSchedule} />
        </div>

        {/* Галерея */}
        {/* <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-700 border-b pb-2">Галерея зображень</h2>
          <p className="text-sm text-gray-600 mb-4">
            Додайте зображення для галереї поїздки. Можна додати URL-адреси зображень.
          </p>
          
          <div className="space-y-4">
            {formData.galleryImages.map((image, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => updateGalleryImage(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="URL зображення"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="px-2 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                >
                  Видалити
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addGalleryImage}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Додати зображення
            </button>
          </div>
        </div> */}
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
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
          {isSubmitting ?  'Оновлення...' :  'Оновити'} подію
        </button>
      </div>
    </form>
  </div>
  );
} 