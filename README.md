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

Add plugin to your `rsbuild.config.ts`:

```ts
// rsbuild.config.ts
import { pluginHtmlMinifierTerser } from "rsbuild-plugin-html-minifier-terser";

export default {
  plugins: [pluginHtmlMinifierTerser()],
};
```

## License

[MIT](./LICENSE).
