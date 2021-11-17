"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * External dependencies
 */
const fast_glob_1 = require("fast-glob");
const path_1 = require("path");
const lodash_1 = require("lodash");
const fs_1 = require("fs");
/**
 * Internal dependencies
 */
const utils_1 = require("../utils");
function build() {
    const root = (0, path_1.join)((0, utils_1.getCurrentWorkingDirectory)(), 'tests', 'data', 'theme-json', '/');
    const files = (0, fast_glob_1.sync)((0, path_1.join)(root, '**/*.json'));
    const themeJson = files.reduce((previousValue, file) => {
        try {
            const content = (0, fs_1.readFileSync)(file, {
                encoding: 'utf-8',
            });
            const config = JSON.parse(content);
            const destination = file.replace(root, '').replace('.json', '');
            const splittedDestination = destination.split('/blocks/');
            if (splittedDestination[0]) {
                let dest = splittedDestination[0].split('/');
                if (splittedDestination[1]) {
                    dest = [...dest, 'blocks', splittedDestination[1]];
                }
                (0, lodash_1.set)(previousValue, dest, config);
            }
        }
        catch (err) {
            console.log(file, err);
        }
        return previousValue;
    }, {});
    (0, fs_1.writeFileSync)((0, path_1.join)((0, utils_1.getCurrentWorkingDirectory)(), 'theme.json'), JSON.stringify(themeJson, null, '\t'));
    console.log('theme.json created');
}
build();
