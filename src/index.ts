import type { NormalizedEnvironmentConfig, RsbuildPlugin } from '@rsbuild/core';
import type { Options as HtmlTerserOptions } from 'html-minifier-terser';
import type { MinifyOptions as TerserOptions } from 'terser';

function applyRemoveConsole(
	options: TerserOptions,
	config: NormalizedEnvironmentConfig,
) {
	const { removeConsole } = config.performance;
	const compressOptions =
		typeof options.compress === 'boolean' ? {} : options.compress || {};

	if (removeConsole === true) {
		options.compress = {
			...compressOptions,
			drop_console: true,
		};
	} else if (Array.isArray(removeConsole)) {
		const pureFuncs = removeConsole.map((method) => `console.${method}`);
		options.compress = {
			...compressOptions,
			pure_funcs: pureFuncs,
		};
	}

	return options;
}

function getTerserMinifyOptions(
	config: NormalizedEnvironmentConfig,
): TerserOptions {
	const options: TerserOptions = {
		mangle: {
			safari10: true,
		},
		format: {
			ascii_only: config.output.charset === 'ascii',
		},
	};

	if (config.output.legalComments === 'none') {
		options.format ||= {};
		options.format.comments = false;
	}

	const finalOptions = applyRemoveConsole(options, config);
	return finalOptions;
}

function getMinifyOptions(
	config: NormalizedEnvironmentConfig,
	options?: Options,
): HtmlTerserOptions {
	const minifyJS: TerserOptions = getTerserMinifyOptions(config);

	const defaultOptions: Options = {
		removeComments: false,
		useShortDoctype: true,
		keepClosingSlash: true,
		collapseWhitespace: true,
		removeRedundantAttributes: true,
		removeScriptTypeAttributes: true,
		removeStyleLinkTypeAttributes: true,
		removeEmptyAttributes: true,
		minifyJS,
		minifyCSS: true,
		minifyURLs: true,
	};

	if (typeof options === 'function') {
		return options(defaultOptions);
	}

	if (typeof options === 'object') {
		return {
			...defaultOptions,
			...options,
		};
	}

	return defaultOptions;
}

type Options =
	| HtmlTerserOptions
	| ((options: HtmlTerserOptions) => HtmlTerserOptions);

export const pluginHtmlMinifierTerser = (options?: Options): RsbuildPlugin => ({
	name: 'plugin-html-minifier-terser',

	setup(api) {
		api.modifyBundlerChain(async (chain, { CHAIN_ID, isProd, environment }) => {
			if (!isProd) {
				return;
			}

			const { minify } = await import('html-minifier-terser');

			const pluginRecord = chain.plugins.entries();
			const minifyOptions = getMinifyOptions(environment.config, options);
			const minifyFn = (html: string) => minify(html, minifyOptions);

			for (const id of Object.keys(pluginRecord)) {
				if (!id.startsWith('html-')) {
					continue;
				}

				// biome-ignore lint/suspicious/noExplicitAny: fix type
				const values = pluginRecord[id].values() as any[];

				const isHtmlRspackPlugin = values.some((item) => {
					const name = item?.name || item.constructor?.name;
					return name === 'HtmlRspackPlugin';
				});

				if (isHtmlRspackPlugin) {
					chain.plugin(id).tap((options) => {
						if (!options.length) {
							return options;
						}
						options[0].minify = minifyFn;
						return options;
					});
					continue;
				}

				// compatible with `html-webpack-plugin`
				const isHtmlWebpackPlugin = values.some((item) => {
					const name = item?.name || item.constructor?.name;
					return name === 'HtmlWebpackPlugin';
				});
				if (isHtmlWebpackPlugin) {
					chain.plugin(id).tap((options) => {
						if (!options.length || options[0].minify) {
							return options;
						}
						options[0].minify = minifyOptions;
						return options;
					});
				}
			}
		});
	},
});
