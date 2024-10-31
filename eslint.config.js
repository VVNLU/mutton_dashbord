// eslint.config.js
import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier'

export default [
  {
    files: ['**/*.js', '**/*.vue'],
    ignores: ['node_modules', 'dist']
  },
  js.configs.recommended,
  {
    plugins: {
      vue,
      prettier
    },
    rules: {
      semi: ['off', 'never'],
      ...vue.configs['vue3-recommended'].rules,
      'prettier/prettier': 'error' // Prettier 規則
    }
  }
]
