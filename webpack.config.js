const path = require('path');
const webpack = require('webpack');
const copy = require('copy-webpack-plugin');
const ContextReplacementPlugin = webpack.ContextReplacementPlugin;

const isDev = process.env.WEBPACK_SERVE != null;

module.exports = {
  entry: {
    'monaco': './monaco.ts',
    // 'editor.worker': 'monaco-editor/esm/vs/language/json/json.worker'
    'editor.worker': './customized.json.worker.ts'
  },
  mode: 'development',  // isDev ? 'development' : 'production',
  output: {
    globalObject: 'self',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  resolve: {
    extensions: ['.ts', '.mjs', '.js'],
    // alias: {
    //   'monaco-editor': 'monaco-editor/esm/vs/editor/edcore.main.js'
    // }
  },
  devtool: 'source-map',
  serve: {
    content: ['./dist']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.json'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new ContextReplacementPlugin(
      /basic-languages/,
      false
    ),
    copy([
      { from: './monaco.html', to: './index.html' },
      { from: './monaco.css', to: './' }
    ])
  ]
}