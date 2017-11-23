var OtherFetchClient = require('../dist/http-fetch-client');
var FetchClient = OtherFetchClient.default;
require('./src')('dist fetch test', FetchClient, OtherFetchClient);
