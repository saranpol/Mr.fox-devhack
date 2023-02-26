module.exports = {
  root: true,
  env: {
    // es6: true,
    es2017: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'google',
  ],
  rules: {
    'quotes': ['error', 'single'],
    'semi': 0,
    'max-len': ['off'],
    'brace-style': 0,
    'require-jsdoc': 0,
    'camelcase': 0,
    'arrow-parens': 0,
    'object-curly-spacing': 0,
    'eol-last': 0,
    'block-spacing': 0,
  },
}
