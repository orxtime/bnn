import { resolve as _resolve, join as _join } from 'path'

export default {
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
    path: _resolve(_join('.', 'dist')),
    globalObject: 'this',
    library: {
      name: 'bnn',
      type: 'umd'
    }
  },
  mode: 'production'
  // mode: 'development'
}
