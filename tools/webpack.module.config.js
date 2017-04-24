/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('lodash');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const commonConfig = require('./webpack.common.config');

const CDN = !!process.env.CDN;

const externals = CDN
  ? {
    jquery: {
      root: 'jQuery',
      commonjs2: 'jquery',
      commonjs: 'jquery',
      amd: 'jquery'
    }
  }
  : nodeExternals({ modulesFromFile: true });

const config = merge({}, commonConfig, {
  output: {
    filename: 'contact-form.js',
    library: 'Auth0ContactForm',
    libraryTarget: 'umd'
  },

  externals: [externals]
});

if (CDN) {
  config.entry.unshift('bootstrap/js/modal');

  // Required to inject jQuery dep on bootstrap/js/modal
  config.plugins.push(
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  );
}

module.exports = config;
