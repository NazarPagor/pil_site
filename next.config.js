/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['picsum.photos', 'images.unsplash.com', 'randomuser.me', 'via.placeholder.com'],
  },
};

module.exports = nextConfig;
