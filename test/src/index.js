var createFakeXhr = require('./fake-xhr-creator').createFakeXhr;

module.exports = function (name, FetchClient) {
  describe(name, function () {
    createFakeXhr();

    require('./get')(FetchClient);
    require('./post')(FetchClient);
    require('./global')(FetchClient);
    require('./retry')(FetchClient);
    require('./catch')(FetchClient);
  });
}
