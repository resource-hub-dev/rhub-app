const path = require('path');

const webpack = require('webpack');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebPackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/patternfly'),
          path.resolve(__dirname, 'node_modules/@patternfly/patternfly'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-styles/css'),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/react-core/dist/styles/base.css'
          ),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/react-core/dist/esm/@patternfly/patternfly'
          ),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/react-core/node_modules/@patternfly/react-styles/css'
          ),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/react-table/node_modules/@patternfly/react-styles/css'
          ),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/react-inline-edit-extension/node_modules/@patternfly/react-styles/css'
          ),
        ],
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(svg|ttf|eot|woff|woff2)$/,
        include: [
          path.resolve(__dirname, 'node_modules/patternfly/dist/fonts'),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/react-core/dist/styles/assets/fonts'
          ),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/react-core/dist/styles/assets/pficon'
          ),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/patternfly/assets/fonts'
          ),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/patternfly/assets/pficon'
          ),
        ],
        exclude: [path.resolve(__dirname, 'assets/images')],
        type: 'asset/resource',
        generator: {
          filename: 'font/[hash][ext][query]',
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|jpeg|gif)$/i,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/patternfly'),
          path.resolve(__dirname, 'assets/images'),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/patternfly/assets/images'
          ),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/react-styles/css/assets/images'
          ),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/react-core/dist/styles/assets/images'
          ),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/react-core/node_modules/@patternfly/react-styles/css/assets/images'
          ),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/react-table/node_modules/@patternfly/react-styles/css/assets/images'
          ),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/react-inline-edit-extension/node_modules/@patternfly/react-styles/css/assets/images'
          ),
        ],
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[hash][ext][query]',
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].bundle.css',
    }),
    new webpack.EnvironmentPlugin({ ...process.env }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new CopyPlugin({
      patterns: [{ from: 'assets', to: 'assets' }],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
      }),
    ],
    symlinks: false,
    cacheWithContext: false,
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
  watchOptions: {
    ignored: [
      path.resolve(__dirname, 'dist'),
      path.resolve(__dirname, 'node_modules'),
    ],
  },
};
