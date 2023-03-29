/**
 * External dependencies
 */
import chokidar from 'chokidar';
import { join } from 'path';

/**
 * Internal dependencies
 */
import build from '../lib/build.mjs';
import {
	getConfig,
	getCurrentWorkingDirectory,
	addTrailingSlash,
} from '../utils/index.mjs';

async function watch() {
	const configs = await getConfig();

	// Initial build
	await build();

	const roots = configs.map((config) =>
		join(getCurrentWorkingDirectory(), addTrailingSlash(config.src)),
	);

	// Watch for changes
	chokidar.watch(roots, { ignoreInitial: true }).on('all', (event, path) => {
		console.log(event, path);
		build();
	});
}

watch();
