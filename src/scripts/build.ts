/**
 * External dependencies
 */
import { sync as fastGlob } from 'fast-glob';
import { join } from 'path';
import { set } from 'lodash';
import { readFileSync, writeFileSync } from 'fs';

/**
 * Internal dependencies
 */
import { getCurrentWorkingDirectory } from '../utils';

async function build() {
	const root = join(
		getCurrentWorkingDirectory(),
		'tests',
		'data',
		'theme-json',
		'/',
	);
	const files = fastGlob(join(root, '**/*.json'));

	const themeJson = files.reduce((previousValue, file) => {
		try {
			const content = readFileSync(file, {
				encoding: 'utf-8',
			});
			const config = JSON.parse(content);

			const destination = file.replace(root, '').replace('.json', '');
			const splittedDestination = destination.split('/blocks/');

			let dest = splittedDestination[0].split('/');
			if (splittedDestination.length !== 1) {
				dest = [...dest, 'blocks', splittedDestination[1]];
			}

			set(previousValue, dest, config);
		} catch (err) {
			console.log(file, err);
		}

		return previousValue;
	}, {});

	writeFileSync(
		join(getCurrentWorkingDirectory(), 'theme.json'),
		JSON.stringify(themeJson, null, '\t'),
	);

	console.log('theme.json created');
}

build();
