const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main_1: './src/script.js',  // Entry point for index.html
    main_2: './src/read.js',  // Entry point for page2.html
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',  // Output file names will be based on entry point (index.bundle.js, page2.bundle.js)
  },
  mode: 'production',  // or 'production' for optimized build
};
