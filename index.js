const ModuleAppenderDependency = require('./lib/module-appender')
const OptionsParser = require('./lib/options-parser')
const { detectReactComponents, generateDisplayNameCode } = require('./lib/component-detector')

const VALID_FILE_SUFFIXES_REGEX = /\.(js|jsx|ts|tsx)$/

// Normally React component names are minified during compilation.  This plugin
// makes these component names available in production bundles by hooking into
// Webpack's compilation process, traversing the AST looking for React component
// definitions, and updating the emitted source code to populate the
// displayName property.  This is the property that, when populated, is used by the React Dev
// Tools extension to determine the name of a component.
//
// For more information on the AST format and API, see:
// https://github.com/estree/estree
// https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API
// noinspection JSUnusedGlobalSymbols
class WebpackReactComponentNamePlugin  {
  constructor(options) {
    this.options = new OptionsParser().parse(options)
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(
      "WebpackReactComponentNamePlugin",
      (compilation) => {
        compilation.dependencyTemplates.set(
          ModuleAppenderDependency,
          new ModuleAppenderDependency.Template()
        )
      }
    )

    compiler.hooks.normalModuleFactory.tap('WebpackReactComponentNamePlugin', factory => {
      factory.hooks.parser.for('javascript/auto').tap('WebpackReactComponentNamePlugin', parser => {
        parser.hooks.program.tap("WebpackReactComponentNamePlugin", ast => {
          // Ignore dependency files
          if (parser.state.current.resource == null
            || !VALID_FILE_SUFFIXES_REGEX.test(parser.state.current.resource.toLowerCase())
            || (this.options.include.length && this.options.include.every(match => !match(parser.state.current.resource)))
            || (this.options.exclude.length && this.options.exclude.some(match => match(parser.state.current.resource)))) {
            return
          }

          // Use shared component detection logic
          detectReactComponents(ast, (node) => {
            const componentName = node.id.name
            const code = generateDisplayNameCode(componentName)

            const dep = new ModuleAppenderDependency(code, node.range)
            dep.loc = node.loc
            parser.state.module.addDependency(dep)
          })
        })
      })
    })
  }
}

module.exports = WebpackReactComponentNamePlugin
