module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  parser: 'babel-eslint',
  rules: {
    'no-underscore-dangle': 0,
    'import/extensions': 0,
    'no-param-reassign': 0,
    'no-use-before-define': ['error', { functions: false, classes: false }],
  },
};
