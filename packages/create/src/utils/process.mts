export const getArgsFromCLI = (excludePrefixes?: string[]) => {
	const args = process.argv.slice(2);
	if (excludePrefixes) {
		return args.filter((arg) => {
			return !excludePrefixes.some((prefix) => arg.startsWith(prefix));
		});
	}
	return args;
};

export const exit = process.exit;
export const getCurrentWorkingDirectory = process.cwd;
