import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import graphqlPlugin from '@graphql-eslint/eslint-plugin';

export default tseslint.config(
  { ignores: ['dist', 'src/generated'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Custom rule to warn about hardcoded strings in JSX
      'prefer-template': 'warn',

      // Add a comment-based rule for now - we'll document this pattern
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'JSXText[value=/[a-zA-Z]{2,}/]',
          message: 'Hardcoded UI strings should be moved to uiText constants. Found: {{value}}',
        },
      ],
    },
  },
  // Temporarily disable hardcoded string warnings for landing page components and tests
  // while another developer is working on them
  {
    files: [
      'src/components/ui/landing/**/*.{ts,tsx}',
      'src/test/components/ui/landing/**/*.{ts,tsx}',
    ],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  // Disable hardcoded string warnings for uiText.tsx since that's where strings SHOULD be
  {
    files: ['src/constants/uiText.tsx'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  // GraphQL configuration
  {
    files: ['**/*.graphql', '**/*.gql'],
    languageOptions: {
      parser: graphqlPlugin.parser,
      parserOptions: {
        graphQLConfig: {
          schema: [
            './src/generated/app-chain-schema.json',
            './src/generated/settlement-chain-schema.json',
          ],
          documents: ['src/graphql/**/*.{graphql,gql}'],
        },
      },
    },
    plugins: {
      '@graphql-eslint': graphqlPlugin,
    },
    rules: {
      ...graphqlPlugin.configs['flat/operations-recommended'].rules,
    },
  }
);
