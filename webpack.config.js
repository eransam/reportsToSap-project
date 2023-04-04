const path = require("path");

module.exports = {
  // ...
  resolve: {
    fallback: {
      url: require.resolve("url/"),
      os: require.resolve("os-browserify/browser"),
      net: require.resolve("net-browserify"),
      stream: require.resolve("stream-browserify"),
      fs: false, // or 'empty' or another module
      stream: false, // or 'empty' or another module
    },
  },
};
