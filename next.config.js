/** @type {import('next').NextConfig} */
const nextConfig = {
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
    domains: ['randomuser.me',"res.cloudinary.com" ],
  },
  productionBrowserSourceMaps: false,
  swcMinify: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
