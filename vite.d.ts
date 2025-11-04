import { PluginOptions } from './types';

/**
 * Vite plugin that makes React component names public on minified bundles
 * by adding displayName properties to component definitions.
 *
 * @example
 * ```js
 * import { defineConfig } from 'vite';
 * import react from '@vitejs/plugin-react';
 * import reactDisplayNamePlugin from 'react-display-name-plugin/vite';
 *
 * export default defineConfig({
 *   plugins: [
 *     react(),
 *     reactDisplayNamePlugin({
 *       parseDependencies: true,
 *       exclude: ['node_modules']
 *     })
 *   ]
 * });
 * ```
 *
 * @param options - Plugin configuration options
 * @returns A Vite plugin instance
 */
declare function reactDisplayNamePlugin(options?: PluginOptions): any;

export = reactDisplayNamePlugin;
