const path = require('path');

const HtmlWebPackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new InterpolateHtmlPlugin({
      RHUB_API_URL: process.env.RHUB_API_URL,
      RHUB_KEYCLOAK_URL: process.env.RHUB_KEYCLOAK_URL,
      RHUB_SSO_ENDPOINT: process.env.RHUB_SSO_ENDPOINT,
      KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
      KEYCLOAK_CLIENT: process.env.KEYCLOAK_CLIENT,
    }),
  ],
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
    historyApiFallback: true,
    host: '0.0.0.0',
    static: {
      directory: path.join(__dirname, 'assets'),
      publicPath: '/assets',
    },
    port: 3000,
  },
});
