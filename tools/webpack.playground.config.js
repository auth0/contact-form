import { merge } from 'lodash';
import commonConfig from './webpack.common.config.js';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import { join } from 'path';

const config = merge({}, commonConfig, {
  entry: [
    'webpack-dev-server/client?http://localhost:3000/',
    // Activate Webpack Dev Server Inline mode with node.js API
    'webpack/hot/dev-server',
    // Playground code:
    './tools/playground'
  ],

  devtool: 'eval-source-map'
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

export default config;
