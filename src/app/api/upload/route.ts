import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Конфігурація Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Максимальний розмір файлу (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Файл не завантажено' },
        { status: 400 }
      );
    }
    
    // Перевірка розміру файлу
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Розмір файлу перевищує ліміт 5MB' },
        { status: 400 }
      );
    }
    
    // Перевірка типу файлу
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Дозволені лише зображення' },
        { status: 400 }
      );
    }

    // Отримання буферу файлу
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Завантаження файлу на Cloudinary через Promise
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'gallery',
          resource_type: 'image',
          // Автоматична оптимізація зображення
          transformation: [
            { width: 1920, height: 1080, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        }
      );
      
      // Перетворення Buffer на stream для Cloudinary
      const bufferStream = require('stream').Readable.from(buffer);
      bufferStream.pipe(uploadStream);
    });
    
    // Очікуємо завершення завантаження
    const uploadResult: any = await uploadPromise;
    
    // Повертаємо URL завантаженого зображення
    return NextResponse.json({ 
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      size: uploadResult.bytes
    });
  } catch (error) {
    console.error('Помилка завантаження зображення:', error);
    return NextResponse.json(
      { error: 'Не вдалося завантажити зображення' },
      { status: 500 }
    );
  }
} 