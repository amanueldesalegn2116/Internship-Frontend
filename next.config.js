/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';
    const baseUrl = rawUrl.trim().replace(/\/+$/, '').replace(/\/api$/, '');
    return [
      {
        source: '/docs',
        destination: `${baseUrl}/docs`,
      },
      {
        source: '/api/docs',
        destination: `${baseUrl}/api/docs`,
      },
      {
        source: '/api/:path*',
        destination: `${baseUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
