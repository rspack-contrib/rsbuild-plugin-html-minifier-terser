import { readFileSync } from 'node:fs';
import { EOL } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { createRsbuild } from '@rsbuild/core';
import { pluginHtmlMinifierTerser } from '../../src';
import { getRandomPort } from '../helper';

const __dirname = dirname(fileURLToPath(import.meta.url));

test('should not minify template when minifyJS is false', async ({ page }) => {
	const rsbuild = await createRsbuild({
		cwd: __dirname,
		rsbuildConfig: {
			html: {
				template: './src/index.html',
			},
			performance: {
				removeConsole: ['log', 'warn'],
			},
			plugins: [
				pluginHtmlMinifierTerser({
					minifyJS: false,
				}),
			],
			server: {
				port: getRandomPort(),
			},
		},
	});

	await rsbuild.build();
	const { server, urls } = await rsbuild.preview();

	await page.goto(urls[0]);

	const test = page.locator('#test');

	await expect(test).toHaveCSS('text-align', 'center');
	await expect(test).toHaveCSS('font-size', '146px');
	await expect(test).toHaveText('Hello Rsbuild!');
	await expect(page.evaluate('window.b')).resolves.toBe(2);

	const htmlFile = join(__dirname, 'dist/index.html');
	const content = readFileSync(htmlFile, 'utf-8');

	expect(
		content.includes('.test{font-size:146px;background-color:green}'),
	).toBeTruthy();
	expect(
		content.includes('#a{text-align:center;line-height:1.5;font-size:1.5rem}'),
	).toBeTruthy();
	expect(content.includes(`window.a = 1;${EOL}`)).toBeTruthy();
	expect(content.includes(`window.b = 2;${EOL}`)).toBeTruthy();
	expect(content.includes(`console.log(111111);${EOL}`)).toBeTruthy();
	expect(content.includes(`console.info(111111);${EOL}`)).toBeTruthy();
	expect(content.includes('console.warn(111111);')).toBeTruthy();

	// keep html comments
	expect(content.includes('<!-- HTML COMMENT-->')).toBeTruthy();

	await server.close();
});
