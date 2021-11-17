#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Internal dependencies
 */
const utils_1 = require("../utils");
const { scriptName, scriptArgs, nodeArgs } = (0, utils_1.getNodeArgsFromCLI)();
if (scriptName) {
    (0, utils_1.spawnScript)(scriptName, scriptArgs, nodeArgs);
}
