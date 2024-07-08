import { defineConfig } from '@rsbuild/core';
import { rsbuildPluginHtmlMinifierTerser } from '../src';

export default defineConfig({
	plugins: [rsbuildPluginHtmlMinifierTerser()],
});
