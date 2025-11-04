const WebpackReactComponentNamePlugin = require('react-display-name-plugin/webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.plugins.push(new WebpackReactComponentNamePlugin());
    return config;
  },
}

module.exports = nextConfig
