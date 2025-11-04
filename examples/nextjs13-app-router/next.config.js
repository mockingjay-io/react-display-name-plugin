const WebpackReactComponentNamePlugin = require('react-display-name-plugin/webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.plugins.push(new WebpackReactComponentNamePlugin());
    return config;
  },
}

module.exports = nextConfig
