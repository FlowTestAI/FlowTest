module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'prettier'],
  rules: {
    'react/prop-types': 'off', // keeping off for first phase
    'no-unused-vars': 'off', // Getting a lot of Error for: '_' is assigned a value but never used  no-unused-vars. For now disabling this because  need to understand more about the use '_'.
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', './src/*'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
