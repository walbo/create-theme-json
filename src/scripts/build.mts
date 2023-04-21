/**
 * External dependencies
 */
import fastGlob from 'fast-glob';
import { join } from 'path';
import _ from 'lodash';
import { readFileSync, writeFileSync } from 'fs';
import { load as loadYaml } from 'js-yaml';

/**
 * Internal dependencies
 */
import { getCurrentWorkingDirectory } from '../utils/index.mjs';

const initialThemeJson = {
	$schema: 'https://schemas.wp.org/trunk/theme.json',
	version: 1,
};

async function build() {
	const root = join(
		getCurrentWorkingDirectory(),
		'tests',
		'data',
		'theme-json',
		'/',
	);
	const files = fastGlob.sync(join(root, '**/*.{json,yml,cjs,mjs}'));

	const themeJson = await files.reduce(async (previousValue, file) => {
		const nextValue = await previousValue;

		try {
			let config;
			const content = readFileSync(file, {
				encoding: 'utf-8',
			});

			if (file.endsWith('.cjs') || file.endsWith('.mjs')) {
				const importedFile = await import(file);
				config = importedFile.default;

				if (typeof config === 'function') {
					config = config();
				}
			} else if (file.endsWith('.yml')) {
				config = loadYaml(content);
			} else {
				config = JSON.parse(content);
			}

			const destination = file
				.replace(root, '')
				.replace('.json', '')
				.replace('.yml', '')
				.replace('.cjs', '')
				.replace('.mjs', '');
			const splittedDestination = destination.split('/blocks/');

			if (splittedDestination[0]) {
				let dest = splittedDestination[0].split('/');
				dest = dest.map(_.camelCase);

				if (splittedDestination[1]) {
					dest = [...dest, 'blocks', splittedDestination[1]];
				}

				_.set(nextValue, dest, config);
			}
		} catch (err) {
			console.log(file, err);
		}

		return nextValue;
	}, Promise.resolve(initialThemeJson));

	writeFileSync(
		join(getCurrentWorkingDirectory(), 'theme.json'),
		JSON.stringify(themeJson, null, '\t'),
	);

	console.log('theme.json created');
}

build();
