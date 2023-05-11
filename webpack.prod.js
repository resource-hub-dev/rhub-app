const HtmlWebPackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: 'production',
  cache: false,
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.template.html',
    }),
    new InterpolateHtmlPlugin({
      RHUB_API_URL: '${RHUB_API_URL}',
      RHUB_KEYCLOAK_URL: '${RHUB_KEYCLOAK_URL}',
      RHUB_SSO_ENDPOINT: '${RHUB_SSO_ENDPOINT}',
      KEYCLOAK_REALM: '${KEYCLOAK_REALM}',
      KEYCLOAK_CLIENT: '${KEYCLOAK_CLIENT}',
      RHUB_BROKER_HOST: '${RHUB_BROKER_HOST}',
      RHUB_BROKER_USERNAME: '${RHUB_BROKER_USERNAME}',
      RHUB_BROKER_PASSWORD: '${RHUB_BROKER_PASSWORD}',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../report.html',
    }),
  ],
});
