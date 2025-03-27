'use client';

import { useEffect, useState } from 'react';

export default function PreviewBanner() {
  const [isPreview, setIsPreview] = useState(false);
  const [previewType, setPreviewType] = useState<string>('');

  useEffect(() => {
    // Check for various preview environments
    const isVercelPreview = window.location.hostname.includes('.vercel.');
    const isPreviewEnv = 
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' || 
      process.env.NEXT_PUBLIC_IS_PREVIEW === 'true' ||
      window.location.hostname === 'localhost';
    
    setIsPreview(isPreviewEnv || isVercelPreview);
    
    // Set the type of preview for the banner message
    if (isVercelPreview) {
      setPreviewType('VERCEL PREVIEW');
    } else if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
      setPreviewType('PREVIEW DEPLOYMENT');
    } else if (window.location.hostname === 'localhost') {
      setPreviewType('LOCAL DEVELOPMENT');
    } else {
      setPreviewType('PREVIEW MODE');
    }
  }, []);

  if (!isPreview) {
    return null;
  }

  return (
    <div className="bg-yellow-500 text-black py-2 px-4 text-center font-bold sticky top-0 z-50">
      {previewType} — Ця версія сайту для тестування і не призначена для публічного доступу
    </div>
  );
} 