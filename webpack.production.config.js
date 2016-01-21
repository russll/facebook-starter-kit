import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import StatsPlugin from 'stats-webpack-plugin';
import autoprefixer from 'autoprefixer';

export default {
  entry: [
    './client/app/app.js'
  ],
  output: {
    path: path.join(__dirname, '/build/client'),
    filename: '/[name]-[hash].min.js',
  },
  resolve : {
    alias: {
      styles: path.join(__dirname, 'client', 'app', 'styles'),
      app: path.join(__dirname, 'client', 'app'),
      components: path.join(__dirname, 'client', 'app', 'components')
    }
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new ExtractTextPlugin('[name]-[hash].min.css'),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify("production")
    }),
    new webpack.NoErrorsPlugin()
  ],
  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] })
  ],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        exclude: path.join(__dirname, 'node_modules'),
        include: path.join(__dirname, 'client'),
        query: {
          presets: ['stage-0', 'react', 'es2015'],
          plugins: ['babel-relay-plugin-loader', 'transform-class-properties'],
        },
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css', 'postcss']
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader'
      }
    ]
  }
}