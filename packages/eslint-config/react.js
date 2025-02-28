import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginReact from 'eslint-plugin-react'
import globals from 'globals'
import { config as baseConfig } from './base.js'

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config} */
export const config = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-props-no-spreading': 0,
      'react/require-default-props': 0,
      'react/jsx-filename-extension': [
        1,
        {
          extensions: ['.js', '.tsx'],
        },
      ],
      'react/function-component-definition': [
        2,
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'function-expression',
        },
      ],
      'jsx-a11y/control-has-associated-label': 'off',
    },
  },
]
