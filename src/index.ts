import type { RsbuildPlugin } from '@rsbuild/core';

export type rsbuildPluginHtmlMinifierTerserOptions = {
	foo?: string;
	bar?: boolean;
};

export const rsbuildPluginHtmlMinifierTerser = (
	options: rsbuildPluginHtmlMinifierTerserOptions = {},
): RsbuildPlugin => ({
	name: 'plugin-example',

	setup() {
		console.log('Hello Rsbuild!', options);
	},
});
