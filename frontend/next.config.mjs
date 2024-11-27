/** @type {import('next').NextConfig} */
const nextConfig = {
  // webpack config
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  
  // rewrites config
  async rewrites() {
    return [
      {
        source: '/api/public/checklist',
        destination: 'http://172.31.71.125:5000/api/public/checklist'
      },
      {
        source: '/api/:path*',
        destination: 'http://172.31.71.125:5000/api/:path*'
      }
    ]
  }
};

export default nextConfig;