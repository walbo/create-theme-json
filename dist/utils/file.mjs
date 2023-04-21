/**
 * External dependencies
 */
import { existsSync, readdirSync } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const fromScriptsRoot = (scriptName) => join(dirname(__dirname), 'scripts', `${scriptName}.mjs`);
export const hasScriptFile = (scriptName) => existsSync(fromScriptsRoot(scriptName));
export const getScripts = () => readdirSync(join(dirname(__dirname), 'scripts'))
    .filter((f) => extname(f) === '.mjs')
    .map((f) => basename(f, '.mjs'));
