const WebpackReactComponentNamePlugin = require("react-display-name-plugin/webpack");

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.plugins.push(new WebpackReactComponentNamePlugin());
    return config;
  },
};
