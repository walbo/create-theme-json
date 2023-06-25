/**
 * External dependencies
 */
import Avj, { AnySchema } from 'ajv-draft-04';
import axios from 'axios';

/**
 * Internal dependencies
 */
import { errorsText } from './utils.mjs';

let schema: {
	data: AnySchema;
};

export const after = async (
	themeJson: Record<string, unknown>,
	config: Record<string, unknown>,
) => {
	const schemaChecker = new Avj({
		allErrors: true,
		strict: true,
		allowMatchingProperties: true,
	});

	const schemaVersion =
		config['wpVersion'] === 'trunk' ? 'trunk' : `wp/${config['wpVersion']}`;

	if (!schema) {
		schema = await axios.get(
			`https://schemas.wp.org/${schemaVersion}/theme.json`,
		);
	}

	const validate = schemaChecker.compile(schema.data);
	const valid = validate(themeJson);

	if (!valid) {
		console.log('\n‼️  Invalid theme.json\n');
		console.log(errorsText(validate?.errors));
	}

	return themeJson;
};
