'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PageData {
  title: string;
  slug: string;
  description: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  isSystem: boolean;
}

export default function EditPageContent({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [pageData, setPageData] = useState<PageData>({
    title: '',
    slug: '',
    description: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    isSystem: false,
  });

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true);
        // В майбутньому замінити на реальний API-запит
        
        // Імітація отримання даних з API
        setTimeout(() => {
          // Припустимо, що ці дані приходять з сервера
          let pageContent;
          
          if (id === '1') { // Головна сторінка
            pageContent = {
              title: 'Головна сторінка',
              slug: '',
              description: 'Головна сторінка сайту паломницького центру',
              content: '<h2>Ласкаво просимо до паломницького центру</h2><p>Наш центр допомагає організувати паломницькі поїздки до святих місць в Україні та закордоном.</p><p>Ми пропонуємо духовний супровід, комфортні умови та доступні ціни.</p>',
              metaTitle: 'Головна | Паломницький центр',
              metaDescription: 'Паломницький центр організовує духовні подорожі до святих місць в Україні та закордоном.',
              isSystem: true,
            };
          } else if (id === '2') { // Про нас
            pageContent = {
              title: 'Про нас',
              slug: 'about',
              description: 'Інформація про паломницький центр, наша місія та цінності',
              content: '<h2>Про наш паломницький центр</h2><p>Наш паломницький центр був заснований у 2010 році з метою організації духовних подорожей для вірян.</p><p>За роки нашої діяльності ми організували сотні паломництв до найважливіших святинь.</p><h3>Наша місія</h3><p>Допомагати людям у їхньому духовному зростанні через паломництва та прощі.</p>',
              metaTitle: 'Про нас | Паломницький центр',
              metaDescription: 'Дізнайтеся більше про наш паломницький центр, нашу місію та цінності.',
              isSystem: true,
            };
          } else { // Інші сторінки
            pageContent = {
              title: 'Правила паломництва',
              slug: 'rules',
              description: 'Важлива інформація для паломників: правила поведінки та рекомендації',
              content: '<h2>Правила для паломників</h2><p>Перед тим, як вирушити в паломництво, ознайомтеся з нашими правилами та рекомендаціями.</p><h3>Загальні правила</h3><ul><li>Поважайте місцеві звичаї та традиції</li><li>Дотримуйтесь вказівок духовного наставника</li><li>Будьте пунктуальними</li></ul>',
              metaTitle: 'Правила паломництва | Паломницький центр',
              metaDescription: 'Правила поведінки та корисні рекомендації для паломників.',
              isSystem: false,
            };
          }
          
          setPageData(pageContent);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
        setError('Помилка завантаження даних сторінки. Спробуйте знову пізніше.');
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPageData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPageData(prev => ({ ...prev, content: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Валідація форми
      if (!pageData.title || !pageData.content) {
        throw new Error('Будь ласка, заповніть всі обов\'язкові поля');
      }

      // Тут буде реальний API-запит у майбутньому
      console.log('Дані сторінки для оновлення:', pageData);
      
      // Імітація відправки запиту
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Сторінку успішно оновлено');
      
      // Прибираємо повідомлення про успіх через 3 секунди
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Помилка відправки форми:', error);
      setError(error instanceof Error ? error.message : 'Виникла помилка при оновленні сторінки');
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
        <h1 className="text-2xl font-bold text-primary-800">Редагування сторінки</h1>
        <Link 
          href="/admin/pages" 
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

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Заголовок сторінки *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={pageData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
              disabled={pageData.isSystem}
            />
            {pageData.isSystem && (
              <p className="mt-1 text-xs text-gray-500">
                Це системна сторінка, заголовок не можна змінити.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              URL сторінки
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">/</span>
              <input
                type="text"
                id="slug"
                name="slug"
                value={pageData.slug}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={pageData.isSystem}
              />
            </div>
            {pageData.isSystem && (
              <p className="mt-1 text-xs text-gray-500">
                Це системна сторінка, URL не можна змінити.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Короткий опис
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={pageData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Вміст сторінки *
          </label>
          <div className="border border-gray-300 rounded-md">
            <div className="bg-gray-50 p-2 border-b flex items-center space-x-2">
              <button
                type="button"
                className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100"
                onClick={() => {
                  const textarea = document.getElementById('content') as HTMLTextAreaElement;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = textarea.value;
                  const before = text.substring(0, start);
                  const selection = text.substring(start, end);
                  const after = text.substring(end, text.length);
                  setPageData(prev => ({
                    ...prev,
                    content: before + `<h2>${selection || 'Заголовок'}</h2>` + after
                  }));
                }}
              >
                H2
              </button>
              <button
                type="button"
                className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100"
                onClick={() => {
                  const textarea = document.getElementById('content') as HTMLTextAreaElement;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = textarea.value;
                  const before = text.substring(0, start);
                  const selection = text.substring(start, end);
                  const after = text.substring(end, text.length);
                  setPageData(prev => ({
                    ...prev,
                    content: before + `<h3>${selection || 'Підзаголовок'}</h3>` + after
                  }));
                }}
              >
                H3
              </button>
              <button
                type="button"
                className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100"
                onClick={() => {
                  const textarea = document.getElementById('content') as HTMLTextAreaElement;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = textarea.value;
                  const before = text.substring(0, start);
                  const selection = text.substring(start, end);
                  const after = text.substring(end, text.length);
                  setPageData(prev => ({
                    ...prev,
                    content: before + `<p>${selection || 'Параграф'}</p>` + after
                  }));
                }}
              >
                P
              </button>
              <button
                type="button"
                className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100"
                onClick={() => {
                  const textarea = document.getElementById('content') as HTMLTextAreaElement;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = textarea.value;
                  const before = text.substring(0, start);
                  const selection = text.substring(start, end);
                  const after = text.substring(end, text.length);
                  const listItems = selection 
                    ? selection.split('\n').map(item => `<li>${item}</li>`).join('') 
                    : '<li>Елемент списку</li>';
                  setPageData(prev => ({
                    ...prev,
                    content: before + `<ul>${listItems}</ul>` + after
                  }));
                }}
              >
                UL
              </button>
              <button
                type="button"
                className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100"
                onClick={() => {
                  const textarea = document.getElementById('content') as HTMLTextAreaElement;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = textarea.value;
                  const before = text.substring(0, start);
                  const selection = text.substring(start, end);
                  const after = text.substring(end, text.length);
                  setPageData(prev => ({
                    ...prev,
                    content: before + `<a href="#">${selection || 'Посилання'}</a>` + after
                  }));
                }}
              >
                Link
              </button>
            </div>
            <textarea
              id="content"
              name="content"
              value={pageData.content}
              onChange={handleContentChange}
              rows={12}
              className="w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-b-md"
              required
            ></textarea>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Ви можете використовувати HTML-теги для форматування тексту.
          </p>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">SEO налаштування</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Мета-заголовок
              </label>
              <input
                type="text"
                id="metaTitle"
                name="metaTitle"
                value={pageData.metaTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Рекомендована довжина: до 60 символів.
              </p>
            </div>
            <div>
              <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Мета-опис
              </label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                value={pageData.metaDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                Рекомендована довжина: до 160 символів.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t">
          <div className="flex justify-end">
            <Link
              href="/admin/pages"
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 mr-3"
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
        </div>
      </form>
      
      {/* Попередній перегляд */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Попередній перегляд</h2>
        <div className="border border-gray-300 rounded-md p-6 bg-gray-50">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: pageData.content }}
          />
        </div>
      </div>
    </div>
  );
} 