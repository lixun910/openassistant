
## Build

Build all packages.

```bash
yarn build
```

Generate declaration files for all packages.

```bash
yarn declaration
```

## Test

```bash
yarn test
```

To test a specific package, use the following command:

```bash
node --experimental-vm-modules node_modules/.bin/jest --selectProjects ui --coverage
```

## Publish packages

```bash
npm run publish-packages
```

1. To test before publishing:

```bash
npm publish --dry-run --workspaces
```

2. To publish only specific packages:

```bash
npm publish -w @openassistant/core -w @openassistant/ui
```
