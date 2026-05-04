module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  extends: ['plugin:@typescript-eslint/recommended'],
  env: { browser: true, node: true, es2021: true },
  settings: { react: { version: 'detect' } },
  rules: {},
};

