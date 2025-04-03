'use client';

import { useState, useEffect } from 'react';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  // facebook: string;
  // instagram: string;
  // youtube: string;
  mapEmbedUrl: string;
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    // facebook: '',
    // instagram: '',
    // youtube: '',
    mapEmbedUrl: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        // У майбутньому замінити на реальний API-запит
        const mockSettings: SiteSettings = {
          siteName: 'Паломницький центр',
          siteDescription: 'Духовні подорожі до святих місць України та світу',
          contactEmail: 'info@example.com',
          contactPhone: '+380501234567',
          address: 'м. Львів, вул. Івана Франка, 123',
          // facebook: 'https://facebook.com/pilgrim.center',
          // instagram: 'https://instagram.com/pilgrim.center',
          // youtube: 'https://youtube.com/pilgrim.center',
          mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d82352.70256752667!2d23.917691291386722!3d49.83261223397082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473add7c09109a57%3A0x4223c517012378e2!2z0JvRjNCy0ZbQsiwg0JvRjNCy0ZbQstGB0YzQutCwINC-0LHQu9Cw0YHRgtGMLCA3OTAwMA!5e0!3m2!1suk!2sua!4v1633594558264!5m2!1suk!2sua',
        };
        
        // Імітація завантаження з API
        setTimeout(() => {
          setSettings(mockSettings);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Помилка завантаження налаштувань:', error);
        setError('Помилка завантаження налаштувань. Спробуйте знову пізніше.');
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Тут буде реальний API-запит у майбутньому
      console.log('Збережені налаштування:', settings);
      
      // Імітація відправки запиту
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Налаштування успішно збережено');
    } catch (error) {
      console.error('Помилка збереження налаштувань:', error);
      setError('Помилка збереження налаштувань. Спробуйте знову пізніше.');
    } finally {
      setIsSaving(false);
      
      // Прибираємо повідомлення про успіх через 5 секунд
      if (!error) {
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      }
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
      <div>
        <h1 className="text-2xl font-bold text-primary-800">Налаштування сайту</h1>
        <p className="mt-1 text-sm text-gray-500">
          Керуйте основними налаштуваннями вашого сайту.
        </p>
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

      {successMessage && (
        <div className="bg-green-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{successMessage}</h3>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="border-b pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Основна інформація</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                  Назва сайту
                </label>
                <input
                  type="text"
                  id="siteName"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Опис сайту
                </label>
                <textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Контактна інформація</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон
                </label>
                <input
                  type="text"
                  id="contactPhone"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Адреса
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="mapEmbedUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Посилання на Google Maps (код для вбудовування)
                </label>
                <textarea
                  id="mapEmbedUrl"
                  name="mapEmbedUrl"
                  value={settings.mapEmbedUrl}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  На Google Maps натисніть &quot;Поділитися&quot;, виберіть &quot;Вбудувати карту&quot; і скопіюйте посилання src з коду.
                </p>
              </div>
            </div>
          </div>

          {/* <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Соціальні мережі</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    https://
                  </span>
                  <input
                    type="text"
                    id="facebook"
                    name="facebook"
                    value={settings.facebook.replace(/^https?:\/\//, '')}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="facebook.com/yourpage"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    https://
                  </span>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={settings.instagram.replace(/^https?:\/\//, '')}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="instagram.com/youraccount"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    https://
                  </span>
                  <input
                    type="text"
                    id="youtube"
                    name="youtube"
                    value={settings.youtube.replace(/^https?:\/\//, '')}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="youtube.com/yourchannel"
                  />
                </div>
              </div>
            </div>
          </div> */}
        </div>

        <div className="px-6 py-4 bg-gray-50 text-right">
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isSaving ? 'Збереження...' : 'Зберегти зміни'}
          </button>
        </div>
      </form>
    </div>
  );
} 