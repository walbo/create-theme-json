/**
 * External dependencies
 */
import { existsSync, readdirSync } from 'fs';
import path from 'path';

export const fromScriptsRoot = (scriptName: string) =>
	path.join(path.dirname(__dirname), 'scripts', `${scriptName}.js`);

export const hasScriptFile = (scriptName: string) =>
	existsSync(fromScriptsRoot(scriptName));

export const getScripts = (): string[] =>
	readdirSync(path.join(path.dirname(__dirname), 'scripts'))
		.filter((f: string) => path.extname(f) === '.js')
		.map((f: string) => path.basename(f, '.js'));
