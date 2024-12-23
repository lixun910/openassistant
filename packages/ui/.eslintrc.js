module.exports = {
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.json'],
        alwaysTryTypes: true
      }
    }
  },
  root: true
};
