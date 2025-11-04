[![Build and Test](https://github.com/mockingjay-io/react-display-name-plugin/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/mockingjay-io/react-display-name-plugin/actions/workflows/build-and-test.yml)
[![codecov](https://codecov.io/gh/mockingjay-io/react-display-name-plugin/graph/badge.svg?token=X8XYSPSGI4)](https://codecov.io/gh/mockingjay-io/react-display-name-plugin)
[![NPM Version](https://img.shields.io/npm/v/react-display-name-plugin)](https://www.npmjs.com/package/react-display-name-plugin)

## Overview

**react-display-name-plugin** is a build plugin for both Webpack and Vite that makes your custom
React components visible within React Dev Tools and other tools that rely on the displayName parameter.

_Note: This package supports Webpack 5 and Vite 2+. For older versions (Webpack 4), see the legacy package [@mockingjay-io/webpack-react-component-name](https://github.com/mockingjay-io/webpack-react-component-name)._

Normally React component names are minified during compilation. This plugin
makes these component names available in production bundles by hooking into
your build tool's compilation process, traversing the AST looking for React component
definitions, and updating the emitted source code to populate the
[displayName](https://reactjs.org/docs/react-component.html#displayname)
property. This is the property that, when populated, is used by the React Dev
Tools extension to determine the name of a component.

Since we emit a `displayName` property value for each React component definition
(critically, **not** every React component _instance_), using this plugin will
result in a small size increase to your production bundles.

## Installation

1. Install via your preferred package manager:

```bash
npm install react-display-name-plugin --save-dev
```

### For Webpack

2. Import and add the plugin to your Webpack configuration:

```js
const ReactDisplayNamePlugin = require('react-display-name-plugin/webpack');

module.exports = {
  // ... other config
  plugins: [
    new ReactDisplayNamePlugin({
      parseDependencies: true,
    })
  ],
};
```

**Next.js users** have to add this within `next.config.js`/`next.config.mjs`/`next.config.ts`. Examples available [here](https://github.com/mockingjay-io/react-display-name-plugin/tree/main/examples).

### For Vite

2. Import and add the plugin to your Vite configuration:

```js
// vite.config.js / vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reactDisplayNamePlugin from 'react-display-name-plugin/vite';

export default defineConfig({
  plugins: [
    react(),
    reactDisplayNamePlugin({
      parseDependencies: true,
    })
  ],
});
```

**Note:** The Vite plugin should be placed after the React plugin in your plugins array, as it needs to run after JSX transformation.

### Core Utilities (Advanced)

For building custom plugins for other bundlers, you can import the core utilities directly:

```js
const {
  detectReactComponents,
  generateDisplayNameCode
} = require('react-display-name-plugin');
const { parse } = require('acorn');

const code = 'function MyComponent() { return <div>Hello</div>; }';
const ast = parse(code, { ecmaVersion: 'latest', sourceType: 'module' });

detectReactComponents(ast, (node) => {
  const componentName = node.id.name;
  const injectionCode = generateDisplayNameCode(componentName);
  console.log(injectionCode); // ;try{MyComponent.displayName="MyComponent";}catch(e){}
});
```

**Available Utilities:**
- `detectReactComponents(ast, callback)` - Walks an AST and detects React components
- `generateDisplayNameCode(componentName)` - Generates displayName injection code
- `argumentCreatesElement(argument)` - Checks if AST node is React.createElement
- `argumentJsx(argument)` - Checks if AST node is JSX transform output (_jsx, _jsxs)
- `shouldAddDisplayName(node)` - Checks if a node should have displayName added

## Options

```json
{
  "parseDependencies": false,
  "include": [],
  "exclude": []
}
```

### parseDependencies

Type: `boolean`
Default: `false`

If set true, the plugin will name the components exported from node_modules.

### include

Type: `(string | RegExp | (path: string) => boolean)[]` Default: `[]`

If the path matches any of the elements in this array, it will be included if it isn't explicitly excluded.

If the item is a `string`, it will use standard glob syntax. If the item is a Regular Expression, the path will be tested against it. If the item is a function, the path will be passed into it for testing.

### exclude

Type: `(string | RegExp | (path: string) => boolean)[]` Default: `[]`

If the path matches any of the elements in this array, it will be excluded.

If the item is a `string`, it will use standard glob syntax. If the item is a Regular Expression, the path will be tested against it. If the item is a function, the path will be passed into it for testing.

A truthy result will be excluded.

## Troubleshooting

As you probably know, there is more than one way to define a React component. This
plugin attempts to detect every possible way of defining a component, but there may
be some we've missed. See the `/examples` directory and the unit tests for examples
of the different permutations of React component definitions that we currently support.

If we are not detecting one of your components, please either file an Issue containing
example source for a component which is not detected, or feel free to open a PR with
the fix.

## Note for Next.js users

In Next.js the plugin may cause warnings like `[webpack.cache.PackFileCacheStrategy] Skipped not serializable cache item` to be generated. These warnings are safe to ignore without any further action. But if you'd like to supress these warnings, as an interim solution, the following snippet can be added to your webpack config.

```js
const webpackComponentNamesAppenderCacheWarning =
  /Skipped not serializable cache item.*ModuleAppenderDependency/i;

config.infrastructureLogging = {
  stream: {
    write: (message) => {
      if (webpackComponentNamesAppenderCacheWarning.test(message)) {
        return;
      }
      process.stderr.write(message);
    },
  },
};
```

## License

This project is licensed under the terms of the MIT license. See `LICENSE.md` for more info.
