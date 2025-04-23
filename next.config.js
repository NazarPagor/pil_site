/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || '',
    NEXT_PUBLIC_IS_PREVIEW: process.env.VERCEL_ENV === 'preview' ? 'true' : 'false',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Environment',
            value: process.env.VERCEL_ENV || 'development',
          },
        ],
      },
    ];
  },
  // Обробка помилок під час білду в продакшн режимі
  typescript: {
    // Попередження типів TS не будуть призводити до фатальних помилок під час білду в продакшн режимі
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  eslint: {
    // Попередження ESLint не будуть призводити до фатальних помилок під час білду в продакшн режимі
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  // Додаткові налаштування для зображень
  images: {
    domains: ['picsum.photos', 'images.unsplash.com', 'randomuser.me', 'via.placeholder.com', "plus.unsplash.com", "unsplash.com"],
  },
  productionBrowserSourceMaps: false,
  swcMinify: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
