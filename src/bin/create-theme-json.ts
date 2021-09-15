#!/usr/bin/env node

/**
 * Internal dependencies
 */
import { getNodeArgsFromCLI, spawnScript } from '../utils';

const { scriptName, scriptArgs, nodeArgs } = getNodeArgsFromCLI();

if (scriptName) {
	spawnScript(scriptName, scriptArgs, nodeArgs);
}
