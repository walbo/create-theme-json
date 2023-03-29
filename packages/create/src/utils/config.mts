/**
 * External dependencies
 */
import { cosmiconfig } from 'cosmiconfig';

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

	if (Array.isArray(config.config)) {
		// Loop through each config object and merge with default config
		for (const currentConfig of config.config) {
			optimizedConfig.push({
				...defaultConfig,
				...currentConfig,
			});
		}
	} else {
		optimizedConfig.push({
			...defaultConfig,
			...config.config,
		});
	}

	return optimizedConfig;
}
