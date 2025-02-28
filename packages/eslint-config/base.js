// base.js
import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import turboPlugin from 'eslint-plugin-turbo'
import tseslint from 'typescript-eslint'
import onlyWarn from 'eslint-plugin-only-warn'
import importPlugin from 'eslint-plugin-import'

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
      import: importPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
      'no-restricted-exports': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/no-extra-non-null-assertion': 'error',
      '@typescript-eslint/no-unnecessary-condition': 0,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'none',
            requireLast: true,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
        },
      ],
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          pathGroupsExcludedImportTypes: ['builtin'],
          groups: [
            'external',
            'internal',
            'index',
            'parent',
            'sibling',
            'builtin',
            'object',
          ],
        },
      ],
      'no-shadow': 'off',
      'no-multiple-empty-lines': 2,
      'no-multi-spaces': 2,
      'no-use-before-define': 'off',
      'import/no-unresolved': 0,
      'import/prefer-default-export': 0,
      'no-underscore-dangle': 0,
      'import/extensions': [
        'error',
        {
          style: 'always',
          gql: 'always',
          graphql: 'always',
          json: 'always',
          svg: 'always',
          riv: 'always',
        },
      ],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.stories.tsx',
            '**/*.test.tsx',
            'jest.setup.js',
            'tests/utils/index.ts',
            '**/*.config.js',
            '**/*.config.ts',
            '**/eslint.config.js',
          ],
        },
      ],
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '.turbo/**'],
  },
]
