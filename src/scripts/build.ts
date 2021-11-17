/**
 * External dependencies
 */
import { sync as fastGlob } from 'fast-glob';
import path from 'path';

/**
 * Internal dependencies
 */
import { getCurrentWorkingDirectory } from '../utils';

const root = path.join(
	getCurrentWorkingDirectory(),
	'tests',
	'data',
	'theme-json',
);
const files = fastGlob(path.join(root, '**/*.json'));
console.log(files);
