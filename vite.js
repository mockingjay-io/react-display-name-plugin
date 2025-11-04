const { parse } = require('acorn')
const OptionsParser = require('./lib/options-parser')
const { detectReactComponents, generateDisplayNameCode } = require('./lib/component-detector')
const fs = require('node:fs')
const path = require('node:path')

const VALID_FILE_SUFFIXES_REGEX = /\.(js|jsx|ts|tsx)$/

// Vite plugin for making React component names public on minified bundles.
// This plugin hooks into Vite's transform pipeline, parses the AST looking for
// React component definitions, and updates the source code to populate the
// displayName property. This property is used by the React Dev Tools extension
// to determine the name of a component.
function ViteReactComponentNamePlugin(options) {
  const parsedOptions = new OptionsParser().parse(options)

  return {
    name: 'vite-react-component-name',

    // Run after other transforms (including JSX/TSX compilation)
    enforce: 'post',

    transform(code, id) {
      fs.mkdirSync('built', { recursive: true })
      try {
        fs.writeFileSync(`built/${path.basename(id)}`, code)
      } catch (e) {}
      // Ignore non-JS files
      if (!VALID_FILE_SUFFIXES_REGEX.test(id.toLowerCase())) {
        return null
      }

      // Apply include/exclude filters
      if (parsedOptions.include.length &&
          parsedOptions.include.every(match => !match(id))) {
        return null
      }
      if (parsedOptions.exclude.length &&
          parsedOptions.exclude.some(match => match(id))) {
        return null
      }

      try {
        // Parse the code into an AST
        const ast = parse(code, {
          ecmaVersion: 'latest',
          sourceType: 'module',
          locations: true,
          ranges: true
        })

        // Collect all the display name injections we need to make
        const injections = []

        // Use shared component detection logic
        detectReactComponents(ast, (node) => {
          const componentName = node.id.name
          const code = generateDisplayNameCode(componentName)

          injections.push({
            position: node.range[1],
            code
          })
        })

        // If no injections needed, return null (no transformation)
        if (injections.length === 0) {
          return null
        }

        // Sort injections by position (descending) so we insert from end to beginning
        // This ensures positions remain valid as we modify the string
        injections.sort((a, b) => b.position - a.position)

        // Apply all injections
        let modifiedCode = code
        for (const injection of injections) {
          modifiedCode =
            modifiedCode.slice(0, injection.position) +
            injection.code +
            modifiedCode.slice(injection.position)
        }

        return {
          code: modifiedCode,
          map: null // Could generate source maps if needed
        }
      } catch (e) {
        // If parsing fails, just return the original code
        // This can happen with TypeScript or experimental syntax
        console.warn(`[vite-react-component-name] Failed to parse ${id}: ${e.message}`)
        return null
      }
    }
  }
}

module.exports = ViteReactComponentNamePlugin
