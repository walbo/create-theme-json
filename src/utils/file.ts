/**
 * External dependencies
 */
import { existsSync, readdirSync } from 'fs';
import { join, dirname, extname, basename } from 'path';

export const fromScriptsRoot = (scriptName: string) =>
	join(dirname(__dirname), 'scripts', `${scriptName}.js`);

export const hasScriptFile = (scriptName: string) =>
	existsSync(fromScriptsRoot(scriptName));

export const getScripts = (): string[] =>
	readdirSync(join(dirname(__dirname), 'scripts'))
		.filter((f) => extname(f) === '.js')
		.map((f) => basename(f, '.js'));
