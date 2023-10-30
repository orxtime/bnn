import { resolve as _resolve, join as _join } from 'path'

export const entry = './src/index.ts'
export const module = {
  rules: [
    {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }
  ]
}
export const resolve = {
  extensions: ['.tsx', '.ts', '.js']
}
export const output = {
  filename: 'index.js',
  path: _resolve(_join('.', 'dist'))
}
export const mode = 'production'

export default {
  entry,
  module,
  resolve,
  output,
  mode
}
