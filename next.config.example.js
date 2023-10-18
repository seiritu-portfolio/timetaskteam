/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  env: {
    baseUrl: 'http://localhost:8000',
  },
  images: {
    domains: ['postimg.cc', 'timetaskteam-dev.s3.ap-northeast-1.amazonaws.com'],
  },
  experimental: {
    outputStandalone: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};
