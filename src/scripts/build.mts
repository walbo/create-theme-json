/**
 * External dependencies
 */
import fastGlob from 'fast-glob';
import { join } from 'path';
import _ from 'lodash';
import { readFileSync, writeFileSync } from 'fs';
import { load as loadYaml } from 'js-yaml';
import Avj from 'ajv-draft-04';
import axios from 'axios';

/**
 * Internal dependencies
 */
import { getCurrentWorkingDirectory } from '../utils/index.mjs';

const initialThemeJson = {
	$schema: 'https://schemas.wp.org/trunk/theme.json',
	version: 2,
};

async function build() {
	const root = join(
		getCurrentWorkingDirectory(),
		'tests',
		'data',
		'theme-json',
		'/',
	);
	const files = fastGlob.sync(join(root, '**/*.{json,yml,cjs,mjs,js}'));

	const themeJson = await files.reduce(async (previousValue, file) => {
		const nextValue = await previousValue;

		try {
			let config;

			if (file.endsWith('.js')) {
				throw new Error(
					'File format not supported. Only .json, .yml, .cjs and .mjs are supported.',
				);
			}

			if (file.endsWith('.cjs') || file.endsWith('.mjs')) {
				const importedFile = await import(file);
				config = importedFile.default;

				if (typeof config === 'function') {
					config = config();
				}
			} else {
				const content = readFileSync(file, {
					encoding: 'utf-8',
				});

				if (file.endsWith('.yml')) {
					config = loadYaml(content);
				} else if (file.endsWith('.json')) {
					config = JSON.parse(content);
				}
			}

			const destination = file.replace(root, '').replace(/\.[^/.]+$/, '');

			const splittedDestination = destination.split('/blocks/');

			if (splittedDestination[0]) {
				let dest = splittedDestination[0].split('/');
				dest = dest.map(_.camelCase);

				if (splittedDestination[1]) {
					const [blockNamespace, blockName, ...blockDest] =
						splittedDestination[1].split('/');
					dest = [
						...dest,
						'blocks',
						`${blockNamespace}/${blockName}`,
						...blockDest,
					];
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

	const schemaChecker = new Avj({
		allErrors: true,
		strict: true,
		allowMatchingProperties: true,
	});
	const schema = await axios.get('https://schemas.wp.org/trunk/theme.json');

	const validate = schemaChecker.compile(schema.data);
	const valid = validate(themeJson);

	if (!valid) {
		validate?.errors?.forEach((err) => {
			console.log(err);
		});
	}

	console.log('theme.json created');
}

build();
