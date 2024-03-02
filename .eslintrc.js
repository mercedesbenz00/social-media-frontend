module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  env: {
    browser: true,
    amd: true,
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'plugin:vue/strongly-recommended',
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
    'prettier',
    './src/types/auto-imports/auto-imports.json',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  ignorePatterns: ['matrix.js'],
  rules: {
    'prettier/prettier': 'off',
    'no-empty-function': 'off',
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-explicit-any': 'off',
    'max-statements': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',

    // not needed for vue 3
    'vue/no-v-html': 'off',
    'vue/attributes-order': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/v-on-event-hyphenation': 'off',
    'vue/no-v-model-argument': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/require-default-prop': 'off',
  },
}
