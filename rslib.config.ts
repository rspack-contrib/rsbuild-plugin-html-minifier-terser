import { defineConfig } from '@rslib/core';

export default defineConfig({
	lib: [
		{ format: 'esm', syntax: 'es2021', dts: true },
		{
			format: 'cjs',
			syntax: 'es2021',
			output: {
				externals: {
					'html-minifier-terser': 'import html-minifier-terser',
				},
			},
		},
	],
	output: {
		target: 'node',
	},
});
