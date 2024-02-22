const moduleResolver = [
  require.resolve('babel-plugin-module-resolver'),
  {
    root: ['./'],
    alias: {
      '@src': './src',
      '@assets': './assets',
      'react-native-sqlite-storage': 'react-native-quick-sqlite',
    },
  },
]

/**
 * @type {import('@babel/parser').ParserOptions}
 */
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    moduleResolver,
    'react-native-reanimated/plugin', // last
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'react-native-paper/babel',
  ],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
}
