import { Dependency, DependencyTemplate } from 'webpack';

/**
 * Webpack dependency that appends code to a module
 */
export class ModuleAppenderDependency extends Dependency {
  expression: string;
  range: [number, number];

  /**
   * Creates a new ModuleAppenderDependency
   * @param expression - The code expression to append
   * @param range - The position range in the source where to append
   */
  constructor(expression: string, range: [number, number]);

  /**
   * Updates the hash with this dependency's data
   * @param hash - The hash object to update
   */
  updateHash(hash: any): void;

  /**
   * Template class for rendering the dependency
   */
  static Template: typeof ModuleAppenderDependencyTemplate;
}

/**
 * Template for applying the ModuleAppenderDependency
 */
declare class ModuleAppenderDependencyTemplate extends DependencyTemplate {
  /**
   * Applies the dependency transformation to the source
   * @param dep - The dependency to apply
   * @param source - The source object to modify
   * @param templateContext - The webpack template context
   */
  apply(dep: ModuleAppenderDependency, source: any, templateContext: any): void;
}

export = ModuleAppenderDependency;
