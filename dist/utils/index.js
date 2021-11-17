"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArgsFromCLI = exports.getCurrentWorkingDirectory = exports.spawnScript = exports.getNodeArgsFromCLI = void 0;
var cli_1 = require("./cli");
Object.defineProperty(exports, "getNodeArgsFromCLI", { enumerable: true, get: function () { return cli_1.getNodeArgsFromCLI; } });
Object.defineProperty(exports, "spawnScript", { enumerable: true, get: function () { return cli_1.spawnScript; } });
var process_1 = require("./process");
Object.defineProperty(exports, "getCurrentWorkingDirectory", { enumerable: true, get: function () { return process_1.getCurrentWorkingDirectory; } });
Object.defineProperty(exports, "getArgsFromCLI", { enumerable: true, get: function () { return process_1.getArgsFromCLI; } });
