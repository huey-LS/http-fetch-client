global.XMLHttpRequest = function () {};

// require('babel-register')({
//   only: /src/,
//   extensions: [".es6", ".es", ".jsx", ".js"]
// });

var OtherFetchClient = require('../src/index');
var FetchClient = OtherFetchClient.default;
require('./src')('es fetch test', FetchClient, OtherFetchClient);
