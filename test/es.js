global.XMLHttpRequest = function () {};

var OtherFetchClient = require('../lib/index');
var FetchClient = OtherFetchClient.default;
require('./src')('es fetch test', FetchClient, OtherFetchClient);
