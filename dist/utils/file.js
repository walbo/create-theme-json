"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScripts = exports.hasScriptFile = exports.fromScriptsRoot = void 0;
/**
 * External dependencies
 */
const fs_1 = require("fs");
const path_1 = require("path");
const fromScriptsRoot = (scriptName) => path_1.default.join(path_1.default.dirname(__dirname), 'scripts', `${scriptName}.js`);
exports.fromScriptsRoot = fromScriptsRoot;
const hasScriptFile = (scriptName) => (0, fs_1.existsSync)((0, exports.fromScriptsRoot)(scriptName));
exports.hasScriptFile = hasScriptFile;
const getScripts = () => (0, fs_1.readdirSync)(path_1.default.join(path_1.default.dirname(__dirname), 'scripts'))
    .filter((f) => path_1.default.extname(f) === '.js')
    .map((f) => path_1.default.basename(f, '.js'));
exports.getScripts = getScripts;
