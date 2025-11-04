import { Compiler } from 'webpack';
import { PluginOptions } from './types';

/**
 * Webpack plugin that makes React component names public on minified bundles
 * by adding displayName properties to component definitions.
 *
 * @example
 * ```js
 * const ReactDisplayNamePlugin = require('react-display-name-plugin/webpack');
 *
 * module.exports = {
 *   plugins: [
 *     new ReactDisplayNamePlugin({
 *       parseDependencies: true,
 *       exclude: ['node_modules']
 *     })
 *   ]
 * };
 * ```
 */
declare class ReactDisplayNamePlugin {
  /**
   * Creates a new instance of the ReactDisplayNamePlugin
   * @param options - Plugin configuration options
   */
  constructor(options?: PluginOptions);

  /**
   * Apply the plugin to the webpack compiler
   * @param compiler - The webpack compiler instance
   */
  apply(compiler: Compiler): void;
}

export = ReactDisplayNamePlugin;
