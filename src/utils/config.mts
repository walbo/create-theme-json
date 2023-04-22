/**
 * External dependencies
 */
import { cosmiconfig } from 'cosmiconfig';

const defaultConfig = {
	validateSchema: true,
	wpVersion: 'trunk',
};

export async function getConfig() {
	const explorerSync = cosmiconfig('create-theme-json');

	const config = (await explorerSync.search()) || { config: {} };

	return {
		...defaultConfig,
		...config.config,
	};
}
