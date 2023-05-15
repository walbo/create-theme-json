/**
 * External dependencies
 */
import chokidar from 'chokidar';
import { join } from 'path';

/**
 * Internal dependencies
 */
import build from '../lib/build.mjs';
import { getConfig, getCurrentWorkingDirectory } from '../utils/index.mjs';

async function watch() {
	const config = await getConfig();

	const src = config.src.endsWith('/') ? config.src : `${config.src}/`;
	const root = join(getCurrentWorkingDirectory(), src);

	// Initial build
	build();

	// Watch for changes
	chokidar.watch(root, { ignoreInitial: true }).on('all', (event, path) => {
		console.log(event, path);
		build();
	});
}

watch();
