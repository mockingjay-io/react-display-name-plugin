import { Compiler } from 'webpack';
import { PluginOptions } from './types';

/**
 * Webpack plugin that makes React component names public on minified bundles
 * by adding displayName properties to component definitions.
 *
 * @example
 * ```js
 * const WebpackReactComponentNamePlugin = require('@mockingjay-io/webpack-react-component-name');
 *
 * module.exports = {
 *   plugins: [
 *     new WebpackReactComponentNamePlugin({
 *       parseDependencies: true,
 *       exclude: ['node_modules']
 *     })
 *   ]
 * };
 * ```
 */
declare class WebpackReactComponentNamePlugin {
  /**
   * Creates a new instance of the WebpackReactComponentNamePlugin
   * @param options - Plugin configuration options
   */
  constructor(options?: PluginOptions);

  /**
   * Apply the plugin to the webpack compiler
   * @param compiler - The webpack compiler instance
   */
  apply(compiler: Compiler): void;
}

export = WebpackReactComponentNamePlugin;
