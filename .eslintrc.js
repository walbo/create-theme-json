module.exports = {
	env: {
		es2021: true,
		jest: true,
		node: true,
	},
	extends: ['eslint:recommended'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	rules: {},
};
