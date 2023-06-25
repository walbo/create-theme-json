# @theme-json/create

Split up your theme.json file into multiple files.

## Installation

You only need to install one npm module:

```bash
npm install @theme-json/create
```

## Setup

This package offers a command-line interface and exposes a binary called `theme-json`.

Example:

```json
{
	"scripts": {
		"build:theme-json": "theme-json build",
		"watch:theme-json": "theme-json watch"
	},
	"theme-json": {
		"src": "theme-json",
		"dest": "theme.json",
		"pretty": false,
		"version": 2
	}
}
```

## File stucture

The build script will look for files in the `theme-json` folder. The folder can
contain `.mjs`, `.cjs` and `.json` files. It is up to the project to decide
how deep the folder structure should be. Ex. you can just have the top level
files `custom-templates.mjs`, `template-parts.mjs`, `settings.mjs` and
`styles.mjs` or you can have a deeper structure like the example below.

```
theme-json
│   custom-templates.mjs
│   template-parts.mjs
│
└───settings
│   │   border.mjs
│   │   color.mjs
│   │   custom.mjs
│   │   layout.mjs
│   │   spacing.mjs
│   │   typography.mjs
│   │
│   └───blocks
│       └───core
│           │   paragraph.mjs
│           │   heading.mjs
│           │   ...
│
└───styles
    │   border.mjs
    │   color.mjs
    │   elements.mjs
    │   spacing.mjs
    │   typography.mjs
    │
    └───blocks
        └───core
            │   paragraph.mjs
            │   heading.mjs
            │   ...
```

## File examples

### theme-json/settings/border.mjs

```mjs
export default {
	border: {
		radius: false,
	},
};
```

### theme-json/settings/border.json

```json
{
	"border": {
		"radius": false
	}
}
```

### theme-json/settings/border.cjs

```cjs
module.exports = {
	border: {
		radius: false,
	},
};
```
