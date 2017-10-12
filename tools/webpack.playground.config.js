/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('lodash');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { join } = require('path');
const commonConfig = require('./webpack.common.config');

const config = merge({}, commonConfig, {
  entry: [
    `webpack-dev-server/client?http://localhost:${process.env.PORT || '3000'}/`,
    // Activate Webpack Dev Server Inline mode with node.js API
    'webpack/hot/dev-server',
    // Playground code:
    './tools/playground'
  ]
});

// Add hot reloading React components
config.plugins.push(new webpack.HotModuleReplacementPlugin());

// Add actual directory to `include` in babel loader
config.module.loaders
  .filter(x => Array.isArray(x.loaders) && x.loaders[0] === 'babel')
  .forEach(x => (x.include.push(join(__dirname))));

config.plugins.push(
  new HtmlWebpackPlugin({
    title: 'Auth0 Contact form',
    template: './tools/playground-template.jade',
    inject: 'body'
  })
);

// Required to inject jQuery dep on bootstrap/js/modal
config.plugins.push(
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
  })
);

module.exports = config;
