let path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: "Virtualso.js",
    path: path.resolve(__dirname, 'dist'),
    library: "Virtualso"
  }
};