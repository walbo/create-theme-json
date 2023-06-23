/**
 * Internal dependencies
 */
const themeJson = require('./theme.json');

test('Check build file', () => {
	expect(themeJson.version).toBe(2);
	expect(themeJson.settings.border.radius).toBeFalsy();
});
