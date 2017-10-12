/* eslint-disable import/no-extraneous-dependencies */
import gulp from 'gulp';
import browserSync from 'browser-sync';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import commonConfig from './tools/webpack.common.config';
import playgroundConfig from './tools/webpack.playground.config';

/**
 * Develop with BrowserSync and HR
 */
gulp.task('start:webpack-dev-server', () => {
  const bundler = webpack(playgroundConfig);

  const server = new WebpackDevServer(bundler, {
    // Enable HMR on the server.
    hot: true,

    // Webpack Dev Middleware can't access config, so we should provide publicPath by ourselves
    publicPath: commonConfig.output.publicPath,

    // pretty colored output
    stats: commonConfig.stats
  });
  server.listen(process.env.PORT || 3000);
});

gulp.task('start:browser-sync', () => {
  const bs = browserSync.create();

  bs.init({
    port: 3001,
    proxy: {
      target: 'localhost:3000'
    }
  });
});

gulp.task('start:dev', ['start:webpack-dev-server', 'start:browser-sync']);
