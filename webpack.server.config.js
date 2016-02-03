import path from 'path';
import webpack from 'webpack';
/*
test
 */
export default {
  entry: ['./server/graphql.js'],
  output: {
    path: path.join(__dirname, './build/server'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  node: {
    console: false,
    global: false,
    process: false,
    buffer: false,
    __filename: false,
    __dirname: false
  },
  externals: /^[a-z\-0-9]+$/,
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(js)$/,
        loaders: ['babel-loader'],
        exclude: path.join(__dirname, '../node_modules'),
      }
    ]
  }
}