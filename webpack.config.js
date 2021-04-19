const path = require('path');

const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const HtmlWebPackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const config = {
  entry: './src/index.tsx',
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
        use: {
          loader: 'file-loader',
          options: {
            limit: 5000,
            outputPath: 'fonts',
            name: '[name].[ext]',
          },
        },
      },
      {
        test: /\.svg$/,
        include: (input) =>
          input.indexOf('fonts') === -1 && input.indexOf('pficon') === -1,
        use: {
          loader: 'raw-loader',
          options: {},
        },
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/i,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/patternfly'),
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
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5000,
              outputPath: 'images',
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].bundle.css',
    }),
    new webpack.EnvironmentPlugin({ ...process.env }),
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
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
    historyApiFallback: true,
    watchOptions: {
      ignored: [
        path.resolve(__dirname, 'dist'),
        path.resolve(__dirname, 'node_modules'),
      ],
    },
  },
};

module.exports = (env, argv) => {
  const isProductionMode = argv.mode === 'production';

  config.plugins.push(
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: isProductionMode ? './index.template.html' : './index.html',
    })
  );

  config.plugins.push(
    new InterpolateHtmlPlugin({
      RHUB_API_URL: isProductionMode
        ? '${RHUB_API_URL}'
        : process.env.RHUB_API_URL,
      RHUB_KEYCLOAK_URL: isProductionMode
        ? '${RHUB_KEYCLOAK_URL}'
        : process.env.RHUB_KEYCLOAK_URL,
      KEYCLOAK_REALM: isProductionMode
        ? '${KEYCLOAK_REALM}'
        : process.env.KEYCLOAK_REALM,
      KEYCLOAK_CLIENT: isProductionMode
        ? '${KEYCLOAK_CLIENT}'
        : process.env.KEYCLOAK_CLIENT,
    })
  );

  if (isProductionMode) {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: '../report.html',
      }),
      new OptimizeCSSAssetsPlugin({})
    );
  }

  return config;
};
