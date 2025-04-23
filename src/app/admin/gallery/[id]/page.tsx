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
        // Fix: Use the correct API endpoint path
        const response = await fetch(`/api/galleries/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch gallery');
        }
        
        const data = await response.json();
        setForm({
          title: data.title,
          description: data.description,
          coverImage: data.coverImage,
          images: data.images.map((img: any) => ({ url: img.url, alt: img.alt || '' }))
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

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const updateUploadedFileAlt = (index: number, alt: string) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      newFiles[index] = { ...newFiles[index], alt };
      return newFiles;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.coverImage && !coverImageFile) newErrors.coverImage = 'Cover image is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSaving(true);
    
    // Handle file uploads first
    let coverImageUrl = form.coverImage;
    
    if (coverImageFile) {
      // Upload cover image
      const formData = new FormData();
      formData.append('file', coverImageFile);
      
      try {
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload cover image');
        }
        
        const uploadData = await uploadResponse.json();
        coverImageUrl = uploadData.url;
      } catch (error) {
        console.error('Error uploading cover image:', error);
        setIsSaving(false);
        return;
      }
    }
    
    // Upload new images
    const processedImages = [...form.images];
    
    for (const uploadedFile of uploadedFiles) {
      const formData = new FormData();
      formData.append('file', uploadedFile.file);
      
      try {
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }
        
        const uploadData = await uploadResponse.json();
        processedImages.push({
          url: uploadData.url,
          alt: uploadedFile.alt
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        setIsSaving(false);
        return;
      }
    }
    
    // Now update the gallery with the new data
    try {
      const updateResponse = await fetch(`/api/galleries/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          coverImage: coverImageUrl,
          images: processedImages
        }),
      });
      
      if (!updateResponse.ok) {
        throw new Error('Failed to update gallery');
      }
      
      // Redirect to gallery list or show success message
      router.push('/admin/gallery');
    } catch (error) {
      console.error('Error updating gallery:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Виправте помилки:</h3>
              <ul className="mt-1 list-disc list-inside text-sm text-red-700">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
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
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.title ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900`}
                  placeholder="Введіть назву галереї"
                  required
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Опис галереї
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
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
            <h2 className="text-xl font-semibold mb-4 text-primary-700 border-b pb-2">Зображення галереї</h2>
            
            {/* Наявні зображення */}
            {form.images.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Наявні зображення:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {form.images.map((image, index) => (
                    <div key={index} className="relative border rounded-md p-2 bg-gray-50">
                      <div className="relative h-32 w-full rounded-md overflow-hidden">
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = [...form.images];
                          newImages.splice(index, 1);
                          setForm({ ...form, images: newImages });
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Додати нові зображення */}
            <div className="space-y-4 mt-6">
              <p className="text-sm font-medium text-gray-700 mb-1">Додати нові зображення:</p>
              <input
                type="file"
                id="galleryImages"
                accept="image/*"
                onChange={handleImagesFileChange}
                multiple
                ref={imagesInputRef}
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
            disabled={isSaving}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isSaving ? 'Збереження...' : 'Зберегти зміни'}
          </button>
        </div>
      </form>
    </div>
  );
}