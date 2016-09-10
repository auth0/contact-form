/* eslint-disable import/no-extraneous-dependencies */
import gulp from 'gulp';
import browserSync from 'browser-sync';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import Promise from 'bluebird';
import commonConfig from './tools/webpack.common.config';
import moduleConfig from './tools/webpack.module.config';
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
  server.listen(3000);
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

/**
 * Create bundles: universal bundle and browser-only bundle
 */
gulp.task('build', () =>
  Promise.all([
    bundle(moduleConfig)
  ])
    .then(stats => {
      stats.forEach(stat => {
        console.log(stat.toString(commonConfig.stats)); // eslint-disable-line no-console
      });
    })
    .catch(err => {
      throw err;
    })
);

function bundle(config) {
  return new Promise((resolve, reject) => {
    webpack(config).run((err, stats) => {
      if (err) {
        return reject(err);
      }

      return resolve(stats);
    });
  });
}
