module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true
  },
  extends: ['standard-with-typescript', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['tsconfig.json'],
    tsconfigRootDir: __dirname // added because unable to read tsconfig file
  },
  rules: {
    indent: ['error', 2],
    quotes: 'off',
    semi: ['warn', 'always'],
    camelcase: ['error', { properties: 'always' }],
    'default-case': 'error',
    // '@typescript-eslint/no-explicit-any': 'warn',
    'no-var': 'error',
    '@typescript-eslint/no-misused-promises': 'off'
  }
};
