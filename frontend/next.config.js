/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*', // змініть порт, якщо у вас інший
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ftp.goit.study', pathname: '/img/**' },
    ],
  },
};

module.exports = nextConfig;