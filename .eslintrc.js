module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  "globals": {
    'window': true,
    'document': true,
    'App': true,
    'Page': true,
    'Component': true,
    'Behavior': true,
    'wx': true,
    'worker': true,
    'getApp': true,
    'regeneratorRuntime': true,
    'getCurrentPages': true
  },
  extends: [
    "eslint:recommended", 
    "plugin:prettier/recommended",
    "plugin:json/recommended"
  ],
  rules: {
    "no-unused-vars": ["error", { "vars": "all", "args": "none" }],
    "no-console": "error",
    "no-debugger": "error",
    "no-useless-escape": "off"
  },
  parserOptions: {
    "ecmaVersion": 8,
    "sourceType": "module",
    "allowImportExportEverywhere": true
  }
};