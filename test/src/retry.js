var assert = require('assert');

var getFakeXhr = require('./fake-xhr-creator').getFakeXhr;

module.exports = function (FetchClient, OtherFetchClient) {
  describe('global auto retry', () => {
    it('retry once', (done) => {
      let fetch = new FetchClient();
      let count = 0;
      let maxRequestCount = 2;
      let globalCount = 0;
      let normalCount = 0;

      fetch.use(function ({ response, request }) {
        // this instanceof Handles
        globalCount++;
        if (response.getBody() !== 'success') {
          try {
            // create fetch task without handles
            let { send, handle } = OtherFetchClient.requestWithoutSend(request);
            // set handles
            handle.use(this);
            send();
            setRespond();
          } catch (e) {
            done(e);
          }
          return Promise.reject();
        }
      });

      fetch
        .get('http://fake.com')
        .use(({ response }) => {
          normalCount++;
          try {
            assert.equal(response.getBody(), 'success');
            assert.equal(globalCount, maxRequestCount);
            assert.equal(normalCount, 1);
            assert.equal(count, maxRequestCount);
            done();
          } catch (e) {
            done(e);
          }
        })
      setRespond();

      function setRespond () {
        count++;
        let { xhr } = getFakeXhr();
        xhr.respond(
          200,
          { 'Content-Type': 'text/plain' },
          count === maxRequestCount ? 'success' : (count + '')
        );
      }
    })
  })
}
