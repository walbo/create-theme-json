/**
 * External dependencies
 */
import _ from 'lodash';

export const before = (themeJson) => {
	console.log('Test: before log');

	// Set border width option to false
	_.set(themeJson, 'settings.border.width', true);

	return themeJson;
};

export const after = (themeJson) => {
	console.log('Test: after log');
	return themeJson;
};
