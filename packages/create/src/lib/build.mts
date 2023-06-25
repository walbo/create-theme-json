/**
 * External dependencies
 */
import { readFileSync, writeFileSync } from 'node:fs';
import fastGlob from 'fast-glob';
import _ from 'lodash';
import pc from 'picocolors';
import deepMerge from 'deepmerge';

/**
 * Internal dependencies
 */
import { getConfig, getPlugins, importFresh } from '../utils/index.mjs';

async function build() {
	const configs = await getConfig();

	for (const config of configs) {
		const { src, version } = config;
		const plugins = await getPlugins(config);

		let initialThemeJson: any = {
			version,
		};

		if (config.addSchema) {
			const schemaVersion =
				config.wpVersion === 'trunk'
					? 'trunk'
					: `wp/${config.wpVersion}`;
			initialThemeJson.$schema = `https://schemas.wp.org/${schemaVersion}/theme.json`;
		}

		if (!!plugins.before.length) {
			initialThemeJson = plugins.before.reduce(
				(previousValue, plugin) => {
					const nextValue = plugin(previousValue, config);
					return nextValue;
				},
				initialThemeJson,
			);
		}

		const files = fastGlob.sync(src + '**/*');

		let themeJson = await files.reduce(async (previousValue, file) => {
			let nextValue = await previousValue;

			try {
				let fileConfig;

				if (file.endsWith('.cjs') || file.endsWith('.mjs')) {
					const importedFile = await importFresh(file);

					fileConfig = importedFile.default;

					if (typeof fileConfig === 'function') {
						fileConfig = fileConfig();
					}
				} else if (file.endsWith('.json')) {
					const content = readFileSync(file, {
						encoding: 'utf-8',
					});

					fileConfig = JSON.parse(content);
				} else {
					console.log(
						pc.red(
							`${file.replace(
								src,
								'',
							)}: File not supported. Supported extensions are: json, cjs and mjs.\n`,
						),
					);
					process.exit(1);
				}

				if (!_.isEmpty(fileConfig)) {
					const destination = file
						.replace(src, '')
						.replace(/\.[^/.]+$/, '');

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

						const newNextValue = _.set({}, dest, fileConfig);
						nextValue = deepMerge(nextValue, newNextValue);
					}
				}
			} catch (err) {
				console.log(file, err);
			}

			return nextValue;
		}, Promise.resolve(initialThemeJson));

		if (!!plugins.after.length) {
			themeJson = plugins.after.reduce((previousValue, plugin) => {
				const nextValue = plugin(previousValue, config);
				return nextValue;
			}, themeJson);
		}

		writeFileSync(
			config.dest,
			JSON.stringify(themeJson, null, config.pretty ? '\t' : ''),
		);
	}

	console.log(pc.green('🎉 theme.json created'));
}

export default build;
