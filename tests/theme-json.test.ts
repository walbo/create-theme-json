/**
 * Internal dependencies
 */
const themeJson = require('./theme.json');

test('Check version', () => {
	expect(themeJson.version).toBe(2);
});
