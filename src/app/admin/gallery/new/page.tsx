'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface ImageData {
  url: string;
  alt: string;
}

export default function NewGalleryPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ file: File, preview: string, alt: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCoverImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => {
        // Create preview for each file
        return new Promise<{ file: File, preview: string, alt: string }>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              file,
              preview: reader.result as string,
              alt: file.name.split('.')[0] // Use filename without extension as alt text
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newFiles).then(files => {
        setUploadedFiles(prev => [...prev, ...files]);
      });
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const updateUploadedFileAlt = (index: number, alt: string) => {
    const newFiles = [...uploadedFiles];
    newFiles[index].alt = alt;
    setUploadedFiles(newFiles);
  };

  // Заглушка імітації завантаження на сервер
  const uploadFilesToServer = async (files: File[]) => {
    // Тут буде реальне завантаження файлів на сервер
    // Наразі просто повертаємо preview URLs для демонстрації
    return files.map((file, index) => {
      const fileInUploadedFiles = uploadedFiles.find(f => f.file === file);
      return {
        url: fileInUploadedFiles?.preview || '',
        alt: fileInUploadedFiles?.alt || `Image ${index + 1}`
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Базова валідація
    if (!title) {
      setError('Назва галереї обов\'язкова');
      return;
    }
    
    if (!coverImageFile) {
      setError('Обкладинка галереї обов\'язкова');
      return;
    }
    
    // Перевіряємо наявність зображень
    if (uploadedFiles.length === 0) {
      setError('Додайте хоча б одне зображення');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Підготовлюємо дані для відправки
      let finalCoverImage = '';
      let finalImages:any = [];
      
      // Якщо є завантажені файли, імітуємо їх завантаження на сервер
      if (uploadedFiles.length > 0) {
        const uploadedImages = await uploadFilesToServer(uploadedFiles.map(f => f.file));
        finalImages = [...finalImages, ...uploadedImages];
      }
      
      // Якщо є завантажена обкладинка, імітуємо її завантаження на сервер
      if (coverImageFile) {
        const uploadedCover = coverImagePreview || '';
        finalCoverImage = uploadedCover;
      }
      
      const response = await fetch('/api/galleries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          coverImage: finalCoverImage,
          images: finalImages,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не вдалося створити галерею');
      }
      
      router.push('/admin/gallery');
      router.refresh();
    } catch (err) {
      console.error('Помилка створення галереї:', err);
      setError('Не вдалося створити галерею. Спробуйте знову.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-800">Створення нової галереї</h1>
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
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          {/* Основна інформація */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary-700 border-b pb-2">Основна інформація</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Назва галереї *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                  placeholder="Введіть назву галереї"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Опис галереї
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                  placeholder="Введіть опис галереї"
                />
              </div>
            </div>
          </div>
          
          {/* Обкладинка галереї */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary-700 border-b pb-2">Обкладинка галереї *</h2>
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  id="coverImageFile"
                  accept="image/*"
                  onChange={handleCoverImageFileChange}
                  className="w-full"
                />
                <p className="mt-1 text-sm text-gray-500">Рекомендований розмір: 1200x800px</p>
                
                {coverImagePreview && (
                  <div className="mt-2">
                    <div className="relative h-48 w-full rounded-md overflow-hidden">
                      <Image
                        src={coverImagePreview}
                        alt="Превью обкладинки"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Зображення галереї */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-primary-700 border-b pb-2">Зображення галереї *</h2>
            <div className="space-y-4">
              <input
                type="file"
                id="galleryImages"
                accept="image/*"
                onChange={handleImagesFileChange}
                multiple
                ref={fileInputRef}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-1">
                Ви можете вибрати декілька зображень одночасно
              </p>
              
              {uploadedFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="relative border rounded-md p-2 bg-gray-50">
                      <div className="relative h-32 w-full rounded-md overflow-hidden">
                        <Image
                          src={file.preview}
                          alt={file.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="mt-2">
                        <input
                          type="text"
                          value={file.alt}
                          onChange={(e) => updateUploadedFileAlt(index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                          placeholder="Альт текст"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeUploadedFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <Link
            href="/admin/gallery"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Скасувати
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Створення...' : 'Створити галерею'}
          </button>
        </div>
      </form>
    </div>
  );
} 