/* eslint-disable import/no-extraneous-dependencies */
import { merge } from 'lodash';
import commonConfig from './webpack.common.config.js';

const REMOVE_MODAL = !!process.env.REMOVE_MODAL;

const config = merge({}, commonConfig, {
  output: {
    filename: REMOVE_MODAL ? 'contact-form-without-modal.js' : 'contact-form.js',
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
