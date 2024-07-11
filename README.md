# rsbuild-plugin-html-minifier-terser

An Rsbuild plugin to use [html-minifier-terser](https://github.com/terser/html-minifier-terser) to minify the HTML outputs.

<p>
  <a href="https://npmjs.com/package/rsbuild-plugin-html-minifier-terser">
   <img src="https://img.shields.io/npm/v/rsbuild-plugin-html-minifier-terser?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
</p>

## Usage

Install:

```bash
npm add rsbuild-plugin-html-minifier-terser -D
```

### Basic

Add plugin to your `rsbuild.config.ts`, HTML will be minified by default and JS minimization affected by Rsbuild's config.

```ts
// rsbuild.config.ts
import { pluginHtmlMinifierTerser } from 'rsbuild-plugin-html-minifier-terser'

export default {
  plugins: [pluginHtmlMinifierTerser()],
}
```

### Customize options

The plugin could accept an parameter of type `HtmlMinifierOptions | ((options: HtmlMinifierOptions) => HtmlMinifierOptions)`.

1. Passing options to customize the minification, fields listed in the options will override the default options.

   ```ts
   export default {
     plugins: [
       pluginHtmlMinifierTerser({
         // `minifyCSS` will be set to false
         minifyCSS: false,
       }),
     ],
   }
   ```

2. A callback function can be passed to the plugin to customize the minification options based on the default options, and the return value will be used as the final options.

   ```ts
   export default {
     plugins: [
       pluginHtmlMinifierTerser((options) => {
         // customize options here
         return options
       }),
     ],
   }
   ```

## License

[MIT](./LICENSE).
