/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'index.js',
    path: path.resolve(path.join('.', 'dist')),
    globalObject: 'this',
    library: {
      // name: 'bnn',
      type: 'commonjs-module'
    }
  },
  mode: 'production'
  // mode: 'development'
}
