/**
 * Matcher function that tests if a file path should be included or excluded
 */
export type MatcherFunction = (path: string) => boolean;

/**
 * Matcher that can be a glob string, RegExp, or function
 */
export type Matcher = string | RegExp | MatcherFunction;

/**
 * Plugin options shared between Webpack and Vite plugins
 */
export interface PluginOptions {
  /**
   * If set true, the plugin will name the components exported from node_modules.
   * @default false
   */
  parseDependencies?: boolean;

  /**
   * If the path matches any of the elements in this array, it will be included
   * if it isn't explicitly excluded.
   *
   * - If the item is a string, it will use standard glob syntax
   * - If the item is a RegExp, the path will be tested against it
   * - If the item is a function, the path will be passed into it for testing
   *
   * @default []
   */
  include?: Matcher[];

  /**
   * If the path matches any of the elements in this array, it will be excluded.
   *
   * - If the item is a string, it will use standard glob syntax
   * - If the item is a RegExp, the path will be tested against it
   * - If the item is a function, the path will be passed into it for testing
   *
   * @default []
   */
  exclude?: Matcher[];
}
