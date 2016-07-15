import { merge } from 'lodash';
import commonConfig from './webpack.common.config.js';

const config = merge({}, commonConfig, {
  output: {
    filename: 'contact-form.js',
    library: 'Auth0ContactForm',
    libraryTarget: 'umd'
  },

  externals: [{
    jquery: {
      root: 'jQuery',
      commonjs2: 'jquery',
      commonjs: 'jquery',
      amd: 'jquery'
    }
  }]
});


export default config;
