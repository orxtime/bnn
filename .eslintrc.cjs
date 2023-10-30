/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    'no-undef': 0,
    'no-useless-escape': 0,
    'no-inferrable-types': 0,
    'lines-around-comment': [
      'error',
      {
        'beforeBlockComment': true
      }
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        'max': 2,
        'maxEOF': 0
      }
    ],
    'comma-dangle': ['error', 'never'],
    'arrow-parens': ['error', 'always'],
    'no-console': 'warn',
    'indent': [
      'error',
      2,
      {
        'SwitchCase': 1
      }
    ],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    '@typescript-eslint/explicit-module-boundary-types': ['error'],
    'camelcase': 2,
    'no-empty': 'error'
  }
}
