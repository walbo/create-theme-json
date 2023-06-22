/**
 * External dependencies
 */
import { cosmiconfig } from 'cosmiconfig';
import { join } from 'path';

/**
 * Internal dependencies
 */
import { getCurrentWorkingDirectory } from './process.mjs';
import { addTrailingSlash } from './file.mjs';

const defaultConfig = {
	src: 'theme-json',
	dest: 'theme.json',
	addSchema: false,
	pretty: false,
	validateSchema: false,
	version: 2,
	wpVersion: 'trunk',
};

export async function getConfig(): Promise<Array<typeof defaultConfig>> {
	const explorerSync = cosmiconfig('theme-json');

	const config = (await explorerSync.search()) || { config: {} };
	const optimizedConfig: Array<typeof defaultConfig> = [];

	if (!Array.isArray(config.config)) {
		config.config = [config.config];
	}

	// Loop through each config object and merge with default config
	for (const currentConfig of config.config) {
		const mergedConfig = {
			...defaultConfig,
			...currentConfig,
		};

		// Make src absolute
		mergedConfig.src = join(
			getCurrentWorkingDirectory(),
			addTrailingSlash(mergedConfig.src),
		);

		// Make dest absolute
		mergedConfig.dest = join(
			getCurrentWorkingDirectory(),
			mergedConfig.dest,
		);

		optimizedConfig.push(mergedConfig);
	}

	return optimizedConfig;
}
