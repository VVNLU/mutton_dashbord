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
      'prettier/prettier': 'error',
      ...vue.configs['vue3-recommended'].rules,
      semi: ['off', 'never'],
      languageOptions: {
        globals: {
          localStorage: 'readonly'
        }
      }
    }
  }
]
