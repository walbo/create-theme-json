/**
 * External dependencies
 */
import { sync as fastGlob } from 'fast-glob';
import { join } from 'path';
import { set, camelCase } from 'lodash';
import { readFileSync, writeFileSync } from 'fs';
import { load as loadYaml } from 'js-yaml';

/**
 * Internal dependencies
 */
import { getCurrentWorkingDirectory } from '../utils';

const initialThemeJson = {
	$schema: 'https://schemas.wp.org/trunk/theme.json',
	version: 1,
};

function build() {
	const root = join(
		getCurrentWorkingDirectory(),
		'tests',
		'data',
		'theme-json',
		'/',
	);
	const files = fastGlob(join(root, '**/*.{json,yml}'));

	const themeJson = files.reduce((previousValue, file) => {
		try {
			let config;
			const content = readFileSync(file, {
				encoding: 'utf-8',
			});

			if (file.endsWith('.yml')) {
				config = loadYaml(content);
			} else {
				config = JSON.parse(content);
			}

			const destination = file
				.replace(root, '')
				.replace('.json', '')
				.replace('.yml', '');
			const splittedDestination = destination.split('/blocks/');

			if (splittedDestination[0]) {
				let dest = splittedDestination[0].split('/');
				dest = dest.map(camelCase);

				if (splittedDestination[1]) {
					dest = [...dest, 'blocks', splittedDestination[1]];
				}

				set(previousValue, dest, config);
			}
		} catch (err) {
			console.log(file, err);
		}

		return previousValue;
	}, initialThemeJson);

	writeFileSync(
		join(getCurrentWorkingDirectory(), 'theme.json'),
		JSON.stringify(themeJson, null, '\t'),
	);

	console.log('theme.json created');
}

build();
