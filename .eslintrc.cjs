/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")
const prettierConfig = require("./prettier.config")
module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    "vue/setup-compiler-macros": true,
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/eslint-config-typescript/recommended",
    "@vue/eslint-config-prettier",
    "plugin:prettier/recommended",
  ],
  rules: {
    "no-unused-vars": "off",
    "max-len": ["error", { code: 200, tabWidth: 2, ignoreUrls: true }],
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/ban-ts-comment": ["error", { "ts-ignore": "allow-with-description" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": ["error", { allow: ["arrowFunctions"] }],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-var-requires": "off",
    "vue/require-default-prop": "off",
    "vue/multi-word-component-names": "off",
    "vue/component-definition-name-casing": ["error", "kebab-case"],
    "vue/attribute-hyphenation": "off",
    "prettier/prettier": ["error", prettierConfig],
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
      },
    },
  ],
}
