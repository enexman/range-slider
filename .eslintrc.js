module.exports = {
  env: {
    browser: true,
    es6: true,
    jquery: true,
  },
  extends: [
    'airbnb-typescript/base',
  ],
  rules: {
    'linebreak-style':'off',
    'import/no-extraneous-dependencies': ['error', {'devDependencies': true}],
    'class-methods-use-this': 'off',
    'no-new': 'off',
    'no-underscore-dangle': 'off',
    'comma-dangle': ['error', 'only-multiline'],
    'consistent-return': [1],
    'no-dupe-class-members': 'off',
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
   ]
  }
};