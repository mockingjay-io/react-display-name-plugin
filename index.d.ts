/**
 * Core utilities for detecting React components and generating displayName code.
 * These can be used to build custom plugins for other bundlers.
 *
 * @example
 * ```js
 * const { detectReactComponents, generateDisplayNameCode } = require('react-display-name-plugin');
 * const { parse } = require('acorn');
 *
 * const code = 'function MyComponent() { return <div>Hello</div>; }';
 * const ast = parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
 *
 * detectReactComponents(ast, (node) => {
 *   const componentName = node.id.name;
 *   const injectionCode = generateDisplayNameCode(componentName);
 *   console.log(injectionCode); // ;try{MyComponent.displayName="MyComponent";}catch(e){}
 * });
 * ```
 */

export {
  detectReactComponents,
  generateDisplayNameCode,
  argumentCreatesElement,
  argumentJsx,
  shouldAddDisplayName,
  ComponentFoundCallback
} from './lib/component-detector';
