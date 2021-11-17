"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnScript = exports.getNodeArgsFromCLI = void 0;
/**
 * External dependencies
 */
const cross_spawn_1 = require("cross-spawn");
/**
 * Internal dependencies
 */
const process_1 = require("./process");
const file_1 = require("./file");
const handleSignal = (signal) => {
    if (signal === 'SIGKILL') {
        console.log('The script failed because the process exited too early. ' +
            'This probably means the system ran out of memory or someone called ' +
            '`kill -9` on the process.');
    }
    else if (signal === 'SIGTERM') {
        console.log('The script failed because the process exited too early. ' +
            'Someone might have called `kill` or `killall`, or the system could ' +
            'be shutting down.');
    }
    (0, process_1.exit)(1);
};
const getNodeArgsFromCLI = () => {
    const args = (0, process_1.getArgsFromCLI)();
    const scripts = (0, file_1.getScripts)();
    const scriptIndex = args.findIndex((arg) => scripts.includes(arg));
    return {
        nodeArgs: args.slice(0, scriptIndex),
        scriptName: args[scriptIndex],
        scriptArgs: args.slice(scriptIndex + 1),
    };
};
exports.getNodeArgsFromCLI = getNodeArgsFromCLI;
const spawnScript = (scriptName, args = [], nodeArgs = []) => {
    if (!scriptName) {
        console.log('Script name is missing.');
        (0, process_1.exit)(1);
    }
    if (!(0, file_1.hasScriptFile)(scriptName)) {
        console.log('Unknown script "' +
            scriptName +
            '". ' +
            'Perhaps you need to update create-theme-json?');
        (0, process_1.exit)(1);
    }
    const { signal, status } = (0, cross_spawn_1.sync)('node', [...nodeArgs, (0, file_1.fromScriptsRoot)(scriptName), ...args], {
        stdio: 'inherit',
    });
    if (signal) {
        handleSignal(signal);
    }
    (0, process_1.exit)(status || undefined);
};
exports.spawnScript = spawnScript;
