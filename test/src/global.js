var assert = require('assert');

var getFakeXhr = require('./fake-xhr-creator').getFakeXhr;

module.exports = function (FetchClient) {
  describe('global', () => {
    it('beforeSend set headers', () => {
      let fetch = new FetchClient();
      fetch
        .use({
          beforeSend: (response, request) => {
            request.setHeaders({
              'X-Custom-Header': 'some'
            });
          }
        });

      fetch
        .get('http://fake.com');

      let { xhr } = getFakeXhr();
      assert.equal(xhr.requestHeaders['X-Custom-Header'], 'some');
      xhr.respond(200, { 'Content-Type': 'text/plain' }, 'test');
    })

    it('on success get body', (done) => {
      let fetch = new FetchClient();
      fetch
        .use({
          success: (response) => {
            try {
              assert.equal(response.text(), 'test');
              done();
            } catch (e) {
              done(e)
            }
          }
        })

      fetch.get('http://fake.com');

      let { xhr } = getFakeXhr();
      xhr.respond(200, { 'Content-Type': 'text/plain' }, 'test');
    });

    it('pass data between global and request', (done) => {
      let fetch = new FetchClient();
      fetch
        .use({
          success: async function (response, request, next) {
            response._global_set = 'global';
            await next();
            try {
              assert.equal(response._use_set, 'use');
              done();
            } catch (e) {
              done(e)
            }
          }
        })

      fetch
        .get('http://fake.com')
        .use((response) => {
          response._use_set = 'use';
          try {
            assert.equal(response._global_set, 'global');
          } catch (e) {
            done(e)
          }
        });

      let { xhr } = getFakeXhr();
      xhr.respond(200, { 'Content-Type': 'text/plain' }, 'test');
    });
  })
}
