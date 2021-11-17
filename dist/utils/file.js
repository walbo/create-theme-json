"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScripts = exports.hasScriptFile = exports.fromScriptsRoot = void 0;
/**
 * External dependencies
 */
const fs_1 = require("fs");
const path_1 = require("path");
const fromScriptsRoot = (scriptName) => (0, path_1.join)((0, path_1.dirname)(__dirname), 'scripts', `${scriptName}.js`);
exports.fromScriptsRoot = fromScriptsRoot;
const hasScriptFile = (scriptName) => (0, fs_1.existsSync)((0, exports.fromScriptsRoot)(scriptName));
exports.hasScriptFile = hasScriptFile;
const getScripts = () => (0, fs_1.readdirSync)((0, path_1.join)((0, path_1.dirname)(__dirname), 'scripts'))
    .filter((f) => (0, path_1.extname)(f) === '.js')
    .map((f) => (0, path_1.basename)(f, '.js'));
exports.getScripts = getScripts;
