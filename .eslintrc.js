module.exports = {
  env: {
    es6: true,
    node: true,
  },
  // Adicione 'prettier' no final desta linha
  extends: ['airbnb-base', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'class-methods-use-this': 'off',
    'import/first': 'off',
    'no-param-reassign': 'off',
    'import/no-extraneous-dependencies': 'off',
    camelcase: 'off',
  },
};
