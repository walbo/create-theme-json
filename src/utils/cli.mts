/**
 * External dependencies
 */
import { sync as spawnSync } from 'cross-spawn';

/**
 * Internal dependencies
 */
import { getArgsFromCLI, exit } from './process.mjs';
import { getScripts, hasScriptFile, fromScriptsRoot } from './file.mjs';

const handleSignal = (signal: string) => {
	if (signal === 'SIGKILL') {
		console.log(
			'The script failed because the process exited too early. ' +
				'This probably means the system ran out of memory or someone called ' +
				'`kill -9` on the process.',
		);
	} else if (signal === 'SIGTERM') {
		console.log(
			'The script failed because the process exited too early. ' +
				'Someone might have called `kill` or `killall`, or the system could ' +
				'be shutting down.',
		);
	}
	exit(1);
};

export const getNodeArgsFromCLI = () => {
	const args = getArgsFromCLI();
	const scripts = getScripts();
	const scriptIndex = args.findIndex((arg) => scripts.includes(arg));
	return {
		nodeArgs: args.slice(0, scriptIndex),
		scriptName: args[scriptIndex],
		scriptArgs: args.slice(scriptIndex + 1),
	};
};

export const spawnScript = (
	scriptName: string,
	args: string[] = [],
	nodeArgs: string[] = [],
) => {
	if (!scriptName) {
		console.log('Script name is missing.');
		exit(1);
	}

	if (!hasScriptFile(scriptName)) {
		console.log(
			'Unknown script "' +
				scriptName +
				'". ' +
				'Perhaps you need to update create-theme-json?',
		);
		exit(1);
	}

	const { signal, status } = spawnSync(
		'node',
		[...nodeArgs, fromScriptsRoot(scriptName), ...args],
		{
			stdio: 'inherit',
		},
	);

	if (signal) {
		handleSignal(signal);
	}

	exit(status || undefined);
};
