/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const poststylus = require('poststylus');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const DEBUG = process.env.NODE_ENV !== 'production';
const CDN = !!process.env.CDN;

const config = {
  entry: ['./src'],

  output: {
    path: CDN ? path.join(__dirname, '../cdn') : path.join(__dirname, '../build'),
    publicPath: ''
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: [path.join(__dirname, '../src')]
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          `css-loader?${JSON.stringify({
            sourceMap: DEBUG,
            minimize: !DEBUG,
            modules: false,
            localIdentName: DEBUG ? '[path][name]--[local]--[hash:base64:5]' : '[hash:base64:4]'
          })}!stylus-loader`
        )
      },
      {
        test: /\.jade$/,
        loader: 'jade'
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('contact-form.css'),
    // Define free variables
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"'
    }),
    // Assign the module and chunk ids by occurrence count
    // Consistent ordering of modules required if using any hashing ([hash] or [chunkhash])
    // https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
    new webpack.optimize.OccurenceOrderPlugin(true),

    ...(DEBUG
      ? []
      : [
        // Search for equal or similar files and deduplicate them in the output
        // https://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
        new webpack.optimize.DedupePlugin(),

        // Minimize all JavaScript output of chunks
        // https://github.com/mishoo/UglifyJS2#compressor-options
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            screw_ie8: true
          }
        })
      ]
    ),
    new webpack.NoErrorsPlugin()
  ],

  stylus: {
    use: [poststylus(['autoprefixer'])]
  },

  target: 'web',

  cache: DEBUG,
  debug: DEBUG,

  stats: {
    colors: true
  },

  devtool: DEBUG ? 'cheap-module-source-map' : 'source-map'
};

module.exports = config;
