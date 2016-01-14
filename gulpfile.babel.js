import { schema } from './data/schema.js';
import { introspectionQuery } from 'graphql/utilities';
import { graphql } from 'graphql';
import gulp from 'gulp';
import gutil from 'gulp-util';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import del from 'del';
import env from 'gulp-env';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import path from 'path';
import fs from 'fs';
import nodemon from 'nodemon';

import webpackProductionConfig from './webpack.production.config.js';
import webpackDevelopmentConfig from './webpack.development.config.js';
import webpackServerConfig from './webpack.server.config.js';

let compiler;

gulp.task('default', ['development']);

// Scenarios
gulp.task('production', ['generate-schema', 'build-production-server', 'build-production']);
gulp.task('development', ['generate-schema', 'build-development-server', 'build-development', 'development-server']);

// Client
gulp.task('build-production', ['clean-client', 'webpack:build-production']);
gulp.task('build-development', ['clean-client', 'webpack:build-development']);

// Server
gulp.task('build-development-server', ['clean-server', 'set-env-development', 'webpack:build-server']);
gulp.task('build-production-server', ['clean-server', 'set-env-production', 'webpack:build-server']);

// Routines

// Webpack
// Client
gulp.task('webpack:build-production', function (callback) {
  // run webpack
  webpack(webpackProductionConfig, function (err, stats) {
    if (err) throw new gutil.PluginError('webpack:build-production', err);
    gutil.log('[webpack:build-production]', stats.toString({
      colors: true
    }));
    callback();
  });
});
gulp.task('webpack:build-development', function (callback) {
  const port = 8000;
  const address = 'localhost';

  compiler = webpack(webpackDevelopmentConfig);
  let server = new WebpackDevServer(compiler, {
    contentBase: path.join(__dirname, 'build', 'client'),
    hot: true,
    noInfo: true,
    stats: {colors: true},
    historyApiFallback: true,
    proxy: {
      '/graphql': 'http://localhost:8080'
    }
  });
  server.listen(port, address, (err, result) => {
    if (err)
      return console.error(err);
    console.log('[webpackDevServer]: listening on http://%s:%s', address, port);
  });
})
// Server
gulp.task('webpack:build-server', function (callback) {
  webpack(webpackServerConfig, function (err, stats) {
    if (err) throw new gutil.PluginError('webpack:build-server', err);
    gutil.log('[webpack:build-server]', stats.toString({
      colors: true
    }));
    callback();
  });
});
gulp.task('backend-watch', () => {
  return new Promise((resolve, reject) => {
    let compiled = false;
    webpack(webpackServerConfig).watch(100, (err, stats) => {
      if (err)
        return reject(err);
      // trigger task completion after first compile
      if (!compiled) {
        compiled = true;
        resolve();
      } else {
        nodemon.restart();
      }
    });
  });
});
gulp.task('development-server', ['backend-watch', 'watch-schema'], () => {
  nodemon({
    execMap: {
      js: 'node'
    },
    script: path.join(__dirname, 'build', 'server', 'index.js'),
    watch: ['foo/'],
    ext: 'noop',
    ignore: ['*']
  }).on('restart', () => {
    console.log('[nodemon]: restart');
  });
});

// Cleaners
gulp.task('clean', function () {
  return del([
    'build/'
  ]);
});
gulp.task('clean-client', function () {
  return del([
    'build/client'
  ]);
});
gulp.task('clean-server', function () {
  return del([
    'build/server'
  ]);
});

// Set environments
gulp.task('set-env-production', function () {
  env({
    NODE_ENV: 'production',
  })
});
gulp.task('set-env-development', function () {
  env({
    NODE_ENV: 'development',
  })
});

// GraphQL schema
gulp.task('generate-schema', () => {
  return graphql(schema, introspectionQuery)
    .then(result => {
      if (result.errors)
        return console.error('[schema]: ERROR --', JSON.stringify(result.errors, null, 2));
      fs.writeFileSync(
        path.join(__dirname, 'data', 'schema.json'),
        JSON.stringify(result, null, 2)
      );
      return compiler ? recompile() : null;
    });
});

function recompile() {
  if (!compiler)
    return null;
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err)
        reject(err);
      console.log('[webpackDevServer]: recompiled');
      resolve();
    });
  });
}

gulp.task('watch-schema', () => {
  gulp.watch(path.join(__dirname, './data', '**/*.js'), ['generate-schema']);
});