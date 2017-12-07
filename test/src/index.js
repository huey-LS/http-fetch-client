var createFakeXhr = require('./fake-xhr-creator').createFakeXhr;

module.exports = function (name, FetchClient, OtherFetchClient) {
  describe(name, function () {
    createFakeXhr();

    require('./get')(FetchClient, OtherFetchClient);
    require('./post')(FetchClient, OtherFetchClient);
    require('./network-status')(FetchClient, OtherFetchClient);
    require('./global')(FetchClient, OtherFetchClient);
    require('./retry')(FetchClient, OtherFetchClient);
    require('./catch')(FetchClient, OtherFetchClient);
  });
}
