// Core utilities for detecting React components and generating displayName code
// These can be used to build custom plugins for other bundlers
const {
  detectReactComponents,
  generateDisplayNameCode,
  argumentCreatesElement,
  argumentJsx,
  shouldAddDisplayName
} = require('./lib/component-detector')

module.exports = {
  detectReactComponents,
  generateDisplayNameCode,
  argumentCreatesElement,
  argumentJsx,
  shouldAddDisplayName
}
