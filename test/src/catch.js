var assert = require('assert');

var getFakeXhr = require('./fake-xhr-creator').getFakeXhr;

module.exports = function (FetchClient) {
  describe('catch when stop', () => {
    let fetch = new FetchClient();
    it('catch', (done) => {
      fetch
        .get('http://fake.com')
        .use(() => {
          return Promise.reject('error');
        }).catch((e) => {
          try {
            assert.equal(e, 'error');
            done();
          } catch (e) {
            done(e);
          }
        })

      let { xhr } = getFakeXhr();
      xhr.respond(200, { 'Content-Type': 'text/plain' }, 'error');
    })
  })
}
