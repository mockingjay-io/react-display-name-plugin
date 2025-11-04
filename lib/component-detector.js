const walk = require("acorn-walk")

/**
 * Helper function to check if a CallExpression argument creates a React element
 */
function argumentCreatesElement(argument) {
  return argument &&
    argument.type === 'MemberExpression' &&
    argument.object &&
    (argument.name === 'React' || argument.object.name === 'React') &&
    argument.property &&
    argument.property.name === 'createElement'
}

/**
 * Helper function to check if a CallExpression argument is JSX transform output
 */
function argumentJsx(argument) {
  return argument &&
    argument.type === "Identifier" &&
    ["_jsxs", "_jsx", "jsx"].includes(argument.name)
}

/**
 * Checks if a node represents a React component that should have displayName added
 */
function shouldAddDisplayName(node) {
  if (!node || !node.id || node.id.type !== 'Identifier') {
    return false
  }

  const componentName = node.id.name

  // Assume lowercase names are helper functions and not Component classes
  if (componentName[0] === componentName[0].toLowerCase()) {
    return false
  }

  return true
}

/**
 * Walks an AST and detects React components, calling the provided callback
 * for each component found.
 *
 * @param {Object} ast - The parsed AST
 * @param {Function} onComponentFound - Callback function called with (node) when a component is found
 */
function detectReactComponents(ast, onComponentFound) {
  const updatedNodes = new Set()

  function addDisplayName(node) {
    if (updatedNodes.has(node)) {
      return // Already processed this node
    }

    if (!shouldAddDisplayName(node)) {
      return
    }

    updatedNodes.add(node)
    onComponentFound(node)
  }

  walk.ancestor(ast, {
    VariableDeclarator(node) {
      // Matches: const Foo extends React._ or import _ from React; const Foo extends _
      if (
        node &&
        node.id &&
        node.id.type === 'Identifier' &&
        node.init && node.init.callee &&
        node.init.callee.type === 'FunctionExpression' &&
        node.init.callee.params &&
        node.init.callee.params.length > 0 &&
        node.init.callee.params[0].type === 'Identifier' &&
        ['_React$Component', '_Component', '_React$PureComponent', '_PureComponent'].includes(node.init.callee.params[0].name)
      ) {
        addDisplayName(node)
      }
    },

    CallExpression(node, state, ancestors) {
      // Matches: const Foo = React.forwardRef((props, ref) => { .. }
      if (
        node &&
        node.callee &&
        ((
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'React' &&
          node.callee.property.name === 'forwardRef'
        ) ||
        (
          state.forwardRefFunctionImported
          && node.callee.type === 'Identifier'
          && node.callee.name ==='forwardRef'
        ) ||
        (
          // with returning statement calling _jsxs (or) _jsx (as in Next.js or tsx)
          argumentJsx(node.callee)
        ))
      ) {
        const variableDeclarator = ancestors.find(ancestor => ancestor.type === 'VariableDeclarator')
        if (variableDeclarator && variableDeclarator.id.name) {
          addDisplayName(variableDeclarator)
        }
      }
      // Matches when function returns JSX/React.createElement()
      else if (
        node &&
        node.callee &&
        ((
          node.callee.type === 'MemberExpression' &&
          node.callee.object &&
          node.callee.object.name === 'React' &&
          node.callee.property &&
          ['createElement', 'memo'].includes(node.callee.property.name)
        ) ||
        (
          state.memoFunctionImported
          && node.callee.type === 'Identifier'
          && node.callee.name ==='memo'
        ))
        && ancestors
        && ancestors.length > 1
      ) {
        const parentAncestor = ancestors[ancestors.length - 2]

        if (parentAncestor && ['ReturnStatement', 'ArrowFunctionExpression'].includes(parentAncestor.type)) {
          // ArrowFunctionExpression is present when no Babel plugins are used when transforming JSX

          const variableDeclaratorIdx = ancestors.findIndex(ancestor => ancestor.type === 'VariableDeclarator')

          if (variableDeclaratorIdx !== -1) {
            const variableDeclarator = ancestors[variableDeclaratorIdx]
            addDisplayName(variableDeclarator)
          }
        } else if (parentAncestor && parentAncestor.type === 'VariableDeclarator') {
          addDisplayName(parentAncestor)
        }
      }
    },

    FunctionDeclaration(node) {
      // Matches: export default function Foo() with returning statement
      if (node && node.id && node.id.type === 'Identifier' && node.body && node.body.body && node.body.body.filter(thing => thing.type === 'ReturnStatement')) {
        const returnStatements = node.body.body.filter(thing => thing.type === 'ReturnStatement')

        if (returnStatements.length > 0) {
          const returnStatement = returnStatements[0]
          if (
            returnStatement &&
            returnStatement.argument &&
            returnStatement.argument.callee &&
            (
              // with returning statement calling React.createElement
              argumentCreatesElement(returnStatement.argument.callee) ||

              // with returning statement calling _jsxs (or) _jsx (as in Next.js)
              argumentJsx(returnStatement.argument.callee)
            )
          ) {
            addDisplayName(node)
          } else if ( // @emotion/babel-preset-css-prop replacing React.createElement with React.Fragment
            returnStatement &&
            returnStatement.argument &&
            returnStatement.argument.callee &&
            returnStatement.argument.callee.name === '___EmotionJSX' &&
            returnStatement.argument.arguments &&
            returnStatement.argument.arguments.length > 0
          ) {
            addDisplayName(node)
          }
        }
      }
    },

    ClassDeclaration(node) {
      // Matches: export default class Foo extends _
      if (
        node &&
        node.id &&
        node.id.type === 'Identifier' &&
        node.superClass &&
        (
          (
            node.superClass.object &&
            node.superClass.object.type === 'Identifier' &&
            node.superClass.object.name === 'React' &&
            node.superClass.property &&
            node.superClass.property.type === 'Identifier' &&
            ['Component', 'PureComponent'].includes(node.superClass.property.name)
          ) ||
          (
            node.superClass.type === 'Identifier' &&
            ['Component', 'PureComponent'].includes(node.superClass.name)
          )
        )
      ) {
        addDisplayName(node)
      }
    },

    ImportDeclaration(node, state) {
      // Matches: import { memo, forwardRef } from 'react'
      if (
          node
          && node.source
          && node.source.value === 'react'
          && node.specifiers
          && node.specifiers.length > 0
      ) {
        state.memoFunctionImported = state.memoFunctionImported || node.specifiers.some(s => s.type === 'ImportSpecifier' && s.imported.name === 'memo' )
        state.forwardRefFunctionImported = state.forwardRefFunctionImported || node.specifiers.some(s => s.type === 'ImportSpecifier' && s.imported.name === 'forwardRef' )
      }
    }
  },
  {
    ...walk.base,
    // Add any objects that acorn-walk doesn't handle by default and thus would throw a ModuleParseError otherwise
    Import: () => {}
  }, {})
}

/**
 * Generates the displayName injection code for a component
 */
function generateDisplayNameCode(componentName) {
  return `;try{${componentName}.displayName="${componentName}";}catch(e){}`
}

module.exports = {
  detectReactComponents,
  generateDisplayNameCode,
  argumentCreatesElement,
  argumentJsx,
  shouldAddDisplayName
}
