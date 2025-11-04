import { PluginOptions, MatcherFunction } from '../types';

/**
 * Internal parsed options with matchers resolved to functions
 */
export interface ParsedOptions {
  parseDependencies: boolean;
  include: MatcherFunction[];
  exclude: MatcherFunction[];
}

/**
 * Reads and validates the options passed to the plugin
 */
export class OptionsParser {
  /**
   * Parses and validates plugin options
   * @param options - The raw plugin options
   * @returns Parsed options with all matchers converted to functions
   * @throws Error if invalid options are provided
   */
  parse(options?: PluginOptions): ParsedOptions;

  /**
   * Default matcher function that ignores node_modules
   * @param path - The file path to check
   * @returns True if the path contains "node_modules"
   */
  ignoreNodeModules(path: string): boolean;
}

export default OptionsParser;
