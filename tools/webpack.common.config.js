/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import webpack from 'webpack';
import poststylus from 'poststylus';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const DEBUG = process.env.NODE_ENV !== 'production';

const REMOVE_MODAL = !!process.env.REMOVE_MODAL;

const config = {
  entry: [
    './src'
  ],

  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: ''
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: [path.join(__dirname, '../src')]
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.styl$/,
      loader: ExtractTextPlugin.extract('style-loader',
        `css-loader?${JSON.stringify({
          sourceMap: DEBUG,
          minimize: !DEBUG,
          modules: false,
          localIdentName: DEBUG ? '[path][name]--[local]--[hash:base64:5]' : '[hash:base64:4]'
        })}!stylus-loader`)
    }, {
      test: /\.jade$/,
      loader: 'jade'
    }]
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

    ...DEBUG ? [] : [
      // Search for equal or similar files and deduplicate them in the output
      // https://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      new webpack.optimize.DedupePlugin(),

      // Minimize all JavaScript output of chunks
      // https://github.com/mishoo/UglifyJS2#compressor-options
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true
        }
      }),

      // A plugin for a more aggressive chunk merging strategy
      // https://webpack.github.io/docs/list-of-plugins.html#aggressivemergingplugin
      new webpack.optimize.AggressiveMergingPlugin()
    ],
    new webpack.NoErrorsPlugin(),

    // Required to inject jQuery dep on bootstrap/js/modal
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],

  stylus: {
    use: [
      poststylus(['autoprefixer'])
    ]
  },

  resolve: {
    alias: {
      'bootstrap/js/modal': REMOVE_MODAL ? 'empty-module': 'bootstrap/js/modal'
    },
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json', '.jade']
  },

  target: 'web',

  cache: DEBUG,
  debug: DEBUG,

  stats: {
    colors: true
  },

  devtool: DEBUG ? 'inline-source-map' : null
};

export default config;
