import WebpackReactComponentNamePlugin from 'react-display-name-plugin/webpack.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.plugins.push(new WebpackReactComponentNamePlugin());
    return config;
  },
};

export default nextConfig;
