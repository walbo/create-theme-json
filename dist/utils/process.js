"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentWorkingDirectory = exports.exit = exports.getArgsFromCLI = void 0;
const getArgsFromCLI = (excludePrefixes) => {
    const args = process.argv.slice(2);
    if (excludePrefixes) {
        return args.filter((arg) => {
            return !excludePrefixes.some((prefix) => arg.startsWith(prefix));
        });
    }
    return args;
};
exports.getArgsFromCLI = getArgsFromCLI;
exports.exit = process.exit;
exports.getCurrentWorkingDirectory = process.cwd;
