/**
 * External dependencies
 */
import chokidar from 'chokidar';

/**
 * Internal dependencies
 */
import build from '../lib/build.mjs';
import { getConfig } from '../utils/index.mjs';

async function watch() {
	const configs = await getConfig();

	// Initial build
	await build();

	const roots = configs.map((config) => config.src);

	// Watch for changes
	chokidar.watch(roots, { ignoreInitial: true }).on('all', (event, path) => {
		console.log(event, path);
		build();
	});
}

watch();
