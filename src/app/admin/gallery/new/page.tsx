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
  const [coverImage, setCoverImage] = useState('');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [images, setImages] = useState<ImageData[]>([{ url: '', alt: '' }]);
  const [uploadedFiles, setUploadedFiles] = useState<{ file: File, preview: string, alt: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<'url' | 'file'>('url');

  const addImageField = () => {
    setImages([...images, { url: '', alt: '' }]);
  };

  const removeImageField = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const updateImageField = (index: number, field: 'url' | 'alt', value: string) => {
    const newImages = [...images];
    newImages[index][field] = value;
    setImages(newImages);
  };

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
    
    if (!coverImage && !coverImageFile) {
      setError('Обкладинка галереї обов\'язкова');
      return;
    }
    
    // Перевіряємо наявність зображень
    const validUrlImages = images.filter(img => img.url.trim() !== '');
    
    if (validUrlImages.length === 0 && uploadedFiles.length === 0) {
      setError('Додайте хоча б одне зображення');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Підготовлюємо дані для відправки
      let finalCoverImage = coverImage;
      let finalImages = [...validUrlImages];
      
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
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Створення нової галереї</h1>
        <Link
          href="/admin/gallery"
          className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
        >
          Назад
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
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
        
        {/* Основна інформація */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Основна інформація</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Назва галереї <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={`w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${!title && 'border-red-300 bg-red-50'}`}
                placeholder="Введіть назву галереї"
              />
              {!title && <p className="mt-1 text-sm text-red-600">Назва галереї обов'язкова</p>}
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
                className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Введіть опис галереї"
              />
            </div>
          </div>
        </div>
        
        {/* Обкладинка галереї */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Обкладинка галереї <span className="text-red-500">*</span></h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setUploadType('url')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    uploadType === 'url' 
                      ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  URL зображення
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType('file')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    uploadType === 'file' 
                      ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  Завантажити файл
                </button>
              </div>
              
              {uploadType === 'url' ? (
                <div>
                  <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
                    URL обкладинки <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="coverImage"
                    value={coverImage}
                    onChange={e => setCoverImage(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${!coverImage && !coverImageFile && 'border-red-300 bg-red-50'}`}
                    placeholder="https://example.com/image.jpg"
                  />
                  {!coverImage && !coverImageFile && (
                    <p className="mt-1 text-sm text-red-600">Завантажте обкладинку галереї</p>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Вибрати файл
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverImageFileChange}
                    />
                    {coverImageFile && (
                      <span className="text-sm text-gray-600">
                        {coverImageFile.name} ({Math.round(coverImageFile.size / 1024)} KB)
                      </span>
                    )}
                  </div>
                  {!coverImage && !coverImageFile && (
                    <p className="mt-1 text-sm text-red-600">Завантажте обкладинку галереї</p>
                  )}
                </div>
              )}
              
              {(coverImage || coverImagePreview) && (
                <div className="mt-4 border rounded-md p-4 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Перегляд обкладинки:</h3>
                  <div className="w-full h-56 relative rounded-md overflow-hidden border bg-white">
                    {coverImagePreview ? (
                      <img 
                        src={coverImagePreview} 
                        alt="Перегляд" 
                        className="w-full h-full object-contain" 
                      />
                    ) : coverImage ? (
                      <img 
                        src={coverImage} 
                        alt="Перегляд" 
                        className="w-full h-full object-contain" 
                      />
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Зображення для галереї */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Зображення для галереї <span className="text-red-500">*</span></h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex space-x-4 mb-6">
              <button
                type="button"
                onClick={() => setUploadType('url')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  uploadType === 'url' 
                    ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                URL зображень
              </button>
              <button
                type="button"
                onClick={() => setUploadType('file')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  uploadType === 'file' 
                    ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                Завантажити файли
              </button>
            </div>
            
            {uploadType === 'url' ? (
              <>
                <div className="space-y-4">
                  {images.map((image, index) => (
                    <div key={index} className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-medium text-gray-700">Зображення {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="text-red-500 hover:text-red-700"
                          disabled={images.length === 1 && uploadedFiles.length === 0}
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label htmlFor={`imageUrl${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            URL зображення <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id={`imageUrl${index}`}
                            value={image.url}
                            onChange={e => updateImageField(index, 'url', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${!image.url && 'border-red-300 bg-red-50'}`}
                            placeholder="https://example.com/image.jpg"
                          />
                          {!image.url && (
                            <p className="mt-1 text-sm text-red-600">URL зображення обов'язковий</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor={`imageAlt${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Опис зображення
                          </label>
                          <input
                            type="text"
                            id={`imageAlt${index}`}
                            value={image.alt}
                            onChange={e => updateImageField(index, 'alt', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Опис зображення для альтернативного тексту"
                          />
                        </div>
                      </div>
                      {image.url && (
                        <div className="mt-4">
                          <h4 className="text-xs font-medium text-gray-500 mb-1">Перегляд:</h4>
                          <div className="w-full h-40 relative rounded-md overflow-hidden border bg-white">
                            <img 
                              src={image.url} 
                              alt={image.alt || `Зображення ${index + 1}`} 
                              className="w-full h-full object-contain" 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={addImageField}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors text-sm font-medium"
                  >
                    <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Додати ще зображення
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <button
                      type="button"
                      onClick={() => document.getElementById('multipleFileInput')?.click()}
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Вибрати файли
                    </button>
                    <input
                      id="multipleFileInput"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImagesFileChange}
                    />
                    <p className="text-sm text-gray-500">Можна вибрати декілька файлів одночасно</p>
                  </div>
                  
                  {uploadedFiles.length === 0 && images.filter(img => img.url).length === 0 && (
                    <p className="text-sm text-red-600">Додайте хоча б одне зображення</p>
                  )}
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Завантажені файли:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="border rounded-md p-3 bg-white shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                              {file.file.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeUploadedFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="w-full h-32 mb-2 relative rounded-md overflow-hidden border bg-gray-50">
                            <img 
                              src={file.preview} 
                              alt={file.alt} 
                              className="w-full h-full object-contain" 
                            />
                          </div>
                          <div>
                            <label htmlFor={`fileAlt${index}`} className="block text-xs font-medium text-gray-700 mb-1">
                              Опис зображення
                            </label>
                            <input
                              type="text"
                              id={`fileAlt${index}`}
                              value={file.alt}
                              onChange={e => updateUploadedFileAlt(index, e.target.value)}
                              className="w-full px-2 py-1 text-sm border rounded-md focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Опис зображення"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Кнопки відправки форми */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/gallery"
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Скасувати
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Створення...
              </>
            ) : (
              <>Створити галерею</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 