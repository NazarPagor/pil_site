'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Image {
  url: string;
  alt: string;
}

interface GalleryForm {
  title: string;
  description: string;
  coverImage: string;
  images: Image[];
}

export default function EditGalleryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [form, setForm] = useState<GalleryForm>({
    title: '',
    description: '',
    coverImage: '',
    images: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{file: File, preview: string, alt: string}>>([]);
  
  const coverImageRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setIsLoading(true);
        // Mock API call - replace with actual API in production
        const response = await fetch(`/api/gallery/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch gallery');
        }
        
        const data = await response.json();
        setForm({
          title: data.title,
          description: data.description,
          coverImage: data.coverImage,
          images: data.images.map((url: string) => ({ url, alt: '' }))
        });
        
        if (data.coverImage) {
          setCoverImagePreview(data.coverImage);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching gallery:', error);
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errors.coverImage) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.coverImage;
        return newErrors;
      });
    }

    const value = e.target.value;
    setForm(prev => ({ ...prev, coverImage: value }));
    setCoverImagePreview(value);
    setCoverImageFile(null);
  };

  const handleCoverImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCoverImagePreview(result);
        setForm(prev => ({ ...prev, coverImage: '' }));
      };
      reader.readAsDataURL(file);

      if (errors.coverImage) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.coverImage;
          return newErrors;
        });
      }
    }
  };

  const handleImagesFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map(file => {
        const reader = new FileReader();
        const preview = new Promise<string>((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
        
        return { file, previewPromise: preview, alt: '' };
      });
      
      Promise.all(newFiles.map(f => f.previewPromise)).then(previews => {
        const filesWithPreviews = newFiles.map((file, index) => ({
          file: file.file,
          preview: previews[index],
          alt: file.alt
        }));
        
        setUploadedFiles(prev => [...prev, ...filesWithPreviews]);
      });
    }
  };

  const removeImage = (index: number) => {
    setForm(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const updateImageAlt = (index: number, alt: string) => {
    setForm(prev => {
      const newImages = [...prev.images];
      newImages[index] = { ...newImages[index], alt };
      return { ...prev, images: newImages };
    });
  };

  const updateUploadedFileAlt = (index: number, alt: string) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      newFiles[index] = { ...newFiles[index], alt };
      return newFiles;
    });
  };

  const addImageField = () => {
    setForm(prev => ({
      ...prev,
      images: [...prev.images, { url: '', alt: '' }]
    }));
  };

  const handleImageChange = (index: number, field: 'url' | 'alt', value: string) => {
    setForm(prev => {
      const newImages = [...prev.images];
      newImages[index] = { ...newImages[index], [field]: value };
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!form.title.trim()) {
      newErrors.title = 'Назва є обов\'язковою';
    }
    
    if (!form.coverImage && !coverImageFile && !coverImagePreview) {
      newErrors.coverImage = 'Обкладинка є обов\'язковою';
    }
    
    const hasImages = form.images.some(img => img.url.trim()) || uploadedFiles.length > 0;
    if (!hasImages) {
      newErrors.images = 'Додайте хоча б одне зображення';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setIsSaving(true);
      
      // In a real application, you would upload the files here
      // For simulation, we'll assume the uploads succeed and return URLs
      
      // Mock file upload for cover image
      let finalCoverImage = form.coverImage;
      if (coverImageFile) {
        // Simulate uploading the cover image file and getting back a URL
        // In a real app, you would use FormData to send the file to your server
        finalCoverImage = URL.createObjectURL(coverImageFile);
      }
      
      // Mock file upload for gallery images
      const uploadedImageUrls = uploadedFiles.map(file => ({
        url: URL.createObjectURL(file.file),
        alt: file.alt
      }));
      
      // Combine existing image URLs with newly uploaded ones
      const finalImages = [
        ...form.images.filter(img => img.url.trim()),
        ...uploadedImageUrls
      ];
      
      // Prepare the data to send to the API
      const galleryData = {
        title: form.title,
        description: form.description,
        coverImage: finalCoverImage,
        images: finalImages,
      };
      
      // Mock API call - replace with actual API in production
      const response = await fetch(`/api/gallery/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(galleryData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update gallery');
      }
      
      // Redirect to gallery list
      router.push('/admin/gallery');
      
    } catch (error) {
      console.error('Error updating gallery:', error);
      setIsSaving(false);
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-primary-800">Редагування галереї</h1>
        <Link 
          href="/admin/gallery" 
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Повернутися до списку
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Основна інформація</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Назва галереї*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                className={`block w-full rounded-md sm:text-sm ${
                  errors.title 
                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Опис
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={form.description}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 sm:text-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Обкладинка галереї*</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL обкладинки
                </label>
                <div className="flex flex-col sm:flex-row">
                  <input
                    type="text"
                    id="coverImage"
                    name="coverImage"
                    value={form.coverImage}
                    onChange={handleCoverImageChange}
                    placeholder="https://example.com/image.jpg"
                    className={`block w-full rounded-md sm:rounded-r-none sm:text-sm mb-2 sm:mb-0 ${
                      errors.coverImage 
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => coverImageRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md sm:rounded-l-none text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg className="h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Завантажити
                  </button>
                  <input
                    type="file"
                    ref={coverImageRef}
                    onChange={handleCoverImageFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                {errors.coverImage && (
                  <p className="mt-1 text-sm text-red-600">{errors.coverImage}</p>
                )}
              </div>
              
              <div>
                {coverImagePreview && (
                  <div className="mt-2 relative rounded-md overflow-hidden h-32 sm:h-40 bg-gray-100">
                    <img
                      src={coverImagePreview}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverImagePreview(null);
                        setCoverImageFile(null);
                        setForm(prev => ({ ...prev, coverImage: '' }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 mb-2 sm:mb-0">Зображення галереї*</h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={addImageField}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Додати URL
              </button>
              <button
                type="button"
                onClick={() => imagesInputRef.current?.click()}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Завантажити файли
              </button>
              <input
                type="file"
                ref={imagesInputRef}
                onChange={handleImagesFileChange}
                multiple
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
          
          {errors.images && (
            <p className="mt-1 mb-4 text-sm text-red-600">{errors.images}</p>
          )}
          
          <div className="space-y-6">
            {/* URLs */}
            {form.images.length > 0 && (
              <div className="space-y-4">
                {form.images.map((image, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">URL зображення</label>
                          <input
                            type="text"
                            value={image.url}
                            onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-primary-500 focus:border-primary-500"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Альтернативний текст</label>
                          <input
                            type="text"
                            value={image.alt}
                            onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Опис зображення"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end space-x-4">
                        {image.url && (
                          <div className="w-16 h-16 relative bg-gray-100 rounded overflow-hidden">
                            <img 
                              src={image.url} 
                              alt={image.alt || "Gallery preview"} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="inline-flex items-center p-2 border border-gray-300 rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-4">
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Завантажені зображення</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-md">
                      <div className="space-y-3">
                        <div className="relative w-full h-40 bg-gray-100 rounded overflow-hidden">
                          <img 
                            src={file.preview} 
                            alt={file.alt || file.file.name}
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => removeUploadedFile(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                          >
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Назва файлу</label>
                          <p className="mt-1 text-sm text-gray-500 truncate">{file.file.name}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Альтернативний текст</label>
                          <input
                            type="text"
                            value={file.alt}
                            onChange={(e) => updateUploadedFileAlt(index, e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Опис зображення"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="px-4 sm:px-6 py-4 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
          <Link
            href="/admin/gallery"
            className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Скасувати
          </Link>
          <button
            type="submit"
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Збереження...
              </>
            ) : 'Зберегти зміни'}
          </button>
        </div>
      </form>
    </div>
  );
}