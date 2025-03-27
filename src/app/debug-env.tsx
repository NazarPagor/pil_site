'use client';

import { useEffect, useState } from 'react';

export default function DebugEnvironment() {
  const [envInfo, setEnvInfo] = useState({
    nodeEnv: 'Завантаження...',
    vercelEnv: 'Завантаження...',
    isPreview: 'Завантаження...',
    hostname: 'Завантаження...',
    isVercelPreview: 'Завантаження...',
    robotsHeader: 'Завантаження...',
  });

  useEffect(() => {
    // Check if domain contains .vercel.
    const isVercelPreview = window.location.hostname.includes('.vercel.');
    
    // Get X-Robots-Tag header if present
    fetch('/api/debug-headers')
      .then(response => response.json())
      .then(data => {
        setEnvInfo({
          nodeEnv: process.env.NODE_ENV || 'не визначено',
          vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV || 'не визначено',
          isPreview: process.env.NEXT_PUBLIC_IS_PREVIEW || 'не визначено',
          hostname: window.location.hostname || 'не визначено',
          isVercelPreview: isVercelPreview ? 'так' : 'ні',
          robotsHeader: data?.robotsHeader || 'не визначено',
        });
      })
      .catch(error => {
        console.error('Error fetching debug headers:', error);
        setEnvInfo({
          nodeEnv: process.env.NODE_ENV || 'не визначено',
          vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV || 'не визначено',
          isPreview: process.env.NEXT_PUBLIC_IS_PREVIEW || 'не визначено',
          hostname: window.location.hostname || 'не визначено',
          isVercelPreview: isVercelPreview ? 'так' : 'ні',
          robotsHeader: 'Помилка отримання',
        });
      });
  }, []);

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg mt-8 mb-8 mx-auto max-w-lg">
      <h2 className="text-xl font-bold mb-4">Інформація про середовище</h2>
      <ul className="space-y-2">
        <li><strong>NODE_ENV:</strong> {envInfo.nodeEnv}</li>
        <li><strong>VERCEL_ENV:</strong> {envInfo.vercelEnv}</li>
        <li><strong>IS_PREVIEW:</strong> {envInfo.isPreview}</li>
        <li><strong>Hostname:</strong> {envInfo.hostname}</li>
        <li><strong>Vercel Preview:</strong> {envInfo.isVercelPreview}</li>
        <li><strong>X-Robots-Tag:</strong> {envInfo.robotsHeader}</li>
      </ul>
      <div className="mt-4 p-2 bg-gray-700 rounded text-sm">
        <p>Ця інформація відображається тільки для розробки і не буде видима в продакшн середовищі.</p>
      </div>
    </div>
  );
} 