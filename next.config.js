/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '25MB',
    },
  },
};

module.exports = nextConfig;
