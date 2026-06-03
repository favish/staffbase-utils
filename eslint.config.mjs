import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { FlatCompat } from '@eslint/eslintrc'
import eslint from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslint.configs.recommended,
  allConfig: eslint.configs.all,
})

export default [
  {
    ignores: ['**/node_modules', '**/dist', '**/coverage'],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:jsdoc/recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ),
  {
    plugins: {
      import: importPlugin,
    },

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        // Lint-only project so type-aware rules also cover test files, which the
        // build tsconfig intentionally excludes from the published output.
        project: './tsconfig.eslint.json',
      },
    },

    settings: {
      react: {
        version: '18',
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
        node: {
          paths: ['src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },

    rules: {
      'jsdoc/require-jsdoc': [
        'warn',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: false,
          },
        },
      ],
      'jsdoc/require-description': 'warn',
      'jsdoc/check-tag-names': 'warn',
      'jsdoc/check-indentation': 'warn',
      'react/jsx-sort-props': [
        'warn',
        { shorthandFirst: true, reservedFirst: true },
      ],
      'react/self-closing-comp': 'warn',
      'import/order': 'off',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 0 }],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    // Test files: don't require JSDoc on every test callback/arrow.
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-description': 'off',
    },
  },
]
