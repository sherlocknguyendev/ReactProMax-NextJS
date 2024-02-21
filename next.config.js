/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // output: 'standalone',
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Chạy local thì http, chạy production thì https
        hostname: 'localhost',
        port: '8000',
        pathname: '/images/**', // Cổng bắt đầu của thư mục ảnh
      },
    ],
  },
};

module.exports = nextConfig;
