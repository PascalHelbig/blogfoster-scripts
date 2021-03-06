const paths = require('./paths');
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  bail: true,
  output: {
    filename: 'index.js',
    path: paths.projectBuild,
  },
  entry: paths.projectIndexJs,
  // Don't touch node core modules like "fs", "path", etc.
  target: 'node',
  // Don't touch module specific globals like __dirname, __filename etc.
  node: false,
  // Don't bundle modules located in the project's `node_modules` folder
  externals: [nodeExternals()],
  // When webpack is resolving modules, let it first look up modules in the
  // projects "node_modules" folder and only after that search in our own.
  resolve: {
    modules: ['node_modules', paths.selfNodeModules],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              [
                require.resolve('babel-preset-env'),
                {
                  targets: {
                    node: '6.10',
                  },
                },
              ],
            ],
            plugins: [
              require.resolve('babel-plugin-syntax-trailing-function-commas'),
              // TODO: Get rid of "transform-class-properties" when there's a
              // plugin for the class fields proposal
              //
              // https://github.com/babel/proposals/issues/12
              require.resolve('babel-plugin-transform-class-properties'),
              require.resolve('babel-plugin-transform-async-to-generator'),
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([paths.projectBuild], { root: paths.projectRoot }),
    new CopyWebpackPlugin([
      {
        context: paths.projectAssets,
        from: '**/*',
        to: paths.projectBuildAssets,
      },
    ]),
  ],
};
