export const before = (themeJson) => {
	console.log('Test: before log');
	return themeJson;
};

export const after = (themeJson) => {
	console.log('Test: after log');
	return themeJson;
};
