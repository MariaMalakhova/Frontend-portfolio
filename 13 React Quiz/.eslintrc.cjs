module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
    es2022: true,
  },

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.json'],
      },
    },
  },

  extends: [
    'eslint:recommended',

    // React
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',

    // Imports
    'plugin:import/recommended',

    // Accessibility (optional but useful)
    'plugin:jsx-a11y/recommended',
  ],

  plugins: [
    'react',
    'react-hooks',
    'import',
    'jsx-a11y',
  ],

  rules: {
    // --------------------
    // Core JavaScript
    // --------------------
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-undef': 'error',
    'no-use-before-define': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    eqeqeq: ['error', 'always'],
    'prefer-const': 'warn',

    // --------------------
    // Formatting / Style
    // --------------------
    indent: ['error', 2],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],

    // --------------------
    // React
    // --------------------
    'react/react-in-jsx-scope': 'off', // React 17+
    'react/prop-types': 'off',
    'react/jsx-key': 'error',

    // --------------------
    // React Hooks (VERY IMPORTANT)
    // --------------------
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // --------------------
    // Imports
    // --------------------
    'import/no-unresolved': 'error',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },

  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    'public/*.js',
  ],
};
