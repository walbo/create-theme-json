/**
 * External dependencies
 */
import fastGlob from 'fast-glob';
import { join } from 'path';
import _ from 'lodash';
import { readFileSync, writeFileSync } from 'fs';
import Avj from 'ajv-draft-04';
import axios from 'axios';
import pc from 'picocolors';

/**
 * Internal dependencies
 */
import {
	getCurrentWorkingDirectory,
	getConfig,
	getPlugins,
} from '../utils/index.mjs';

async function build() {
	const config = await getConfig();

	const schemaVersion =
		config.wpVersion === 'trunk' ? 'trunk' : `wp/${config.wpVersion}`;
	const schemaUrl = `https://schemas.wp.org/${schemaVersion}/theme.json`;

	const initialThemeJson: any = {
		version: config.version,
	};

	if (config.addSchema) {
		initialThemeJson.$schema = schemaUrl;
	}

	const supportedFileFormats = ['json', 'cjs', 'mjs'];

	const src = config.src.endsWith('/') ? config.src : `${config.src}/`;
	const root = join(getCurrentWorkingDirectory(), src);
	const files = fastGlob.sync(join(root, `**/*`));

	let themeJson = await files.reduce(async (previousValue, file) => {
		const nextValue = await previousValue;

		try {
			let fileConfig;

			if (!supportedFileFormats.includes(file?.split('.').pop() || '')) {
				console.log(
					pc.red(
						`${file.replace(
							root,
							'',
						)}: File not supported. Supported extensions are: ${supportedFileFormats.join(
							', ',
						)}.\n`,
					),
				);
				process.exit(1);
			}

			if (file.endsWith('.cjs') || file.endsWith('.mjs')) {
				const importedFile = await import(file);
				fileConfig = importedFile.default;

				if (typeof fileConfig === 'function') {
					fileConfig = fileConfig();
				}
			} else {
				const content = readFileSync(file, {
					encoding: 'utf-8',
				});

				if (file.endsWith('.json')) {
					fileConfig = JSON.parse(content);
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

				_.set(nextValue, dest, fileConfig);
			}
		} catch (err) {
			console.log(file, err);
		}

		return nextValue;
	}, Promise.resolve(initialThemeJson));

	const plugins = await getPlugins();

	for (const plugin of plugins) {
		themeJson = await plugin(themeJson);
	}

	writeFileSync(
		join(getCurrentWorkingDirectory(), config.dest),
		JSON.stringify(themeJson, null, config.pretty ? '\t' : ''),
	);

	if (config.validateSchema) {
		const schemaChecker = new Avj({
			allErrors: true,
			strict: true,
			allowMatchingProperties: true,
		});
		const schema = await axios.get(schemaUrl);

		const validate = schemaChecker.compile(schema.data);
		const valid = validate(themeJson);

		if (!valid) {
			validate?.errors?.forEach((err) => {
				console.log(err);
			});
		}
	}

	console.log('theme.json created');
}

build();
