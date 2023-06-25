/**
 * External dependencies
 */
import _ from 'lodash';
import pc from 'picocolors';
import type { ErrorObject } from 'ajv';

export function errorsText(errors: ErrorObject[] | undefined | null): string {
	if (!errors || errors.length === 0) {
		return 'No errors';
	}

	return (
		errors
			.map((err) => {
				if (!_.isEmpty(err.instancePath)) {
					return `${err.instancePath} ${err.message}`;
				}

				return err.message;
			})
			.reduce((text, msg) => `${text}${pc.red('error')} ${msg}\n`, '') ||
		''
	);
}
