import { Node } from 'acorn';

/**
 * Callback function called when a React component is detected
 * @param node - The AST node representing the component definition
 */
export type ComponentFoundCallback = (node: Node & { id: { name: string } }) => void;

/**
 * Walks an AST and detects React components, calling the provided callback
 * for each component found.
 *
 * @param ast - The parsed AST from acorn
 * @param onComponentFound - Callback function called with the node when a component is found
 */
export function detectReactComponents(
  ast: Node,
  onComponentFound: ComponentFoundCallback
): void;

/**
 * Generates the displayName injection code for a component
 * @param componentName - The name of the component
 * @returns The code string to inject after the component definition
 */
export function generateDisplayNameCode(componentName: string): string;

/**
 * Checks if a CallExpression argument creates a React element
 * @param argument - The AST node to check
 * @returns True if the argument represents React.createElement
 */
export function argumentCreatesElement(argument: any): boolean;

/**
 * Checks if a CallExpression argument is JSX transform output (_jsx, _jsxs)
 * @param argument - The AST node to check
 * @returns True if the argument represents JSX transform output
 */
export function argumentJsx(argument: any): boolean;

/**
 * Checks if a node represents a React component that should have displayName added
 * @param node - The AST node to check
 * @returns True if the node should have displayName added
 */
export function shouldAddDisplayName(node: any): boolean;
