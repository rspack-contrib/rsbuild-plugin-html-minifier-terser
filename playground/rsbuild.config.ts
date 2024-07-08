import { defineConfig } from '@rsbuild/core';
import { pluginHtmlMinifierTerser } from '../src';

export default defineConfig({
	plugins: [pluginHtmlMinifierTerser()],
});
