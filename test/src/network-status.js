var assert = require('assert');

var getFakeXhr = require('./fake-xhr-creator').getFakeXhr;

module.exports = function (FetchClient) {
  describe('catch network status', () => {
    let fetch = new FetchClient();
    it('should catch http status 0', (done) => {
      fetch
        .get('http://fake.com')
        .use({
          error: (response) => {
            try {
              assert.equal(response.ok, false);
              assert.equal(response.status, 0);
              done();
            } catch (e) {
              done(e);
            }
          }
        })

      let { xhr } = getFakeXhr();
      xhr.respond(0, { 'Content-Type': 'text/plain' }, 'error');
    })

    it('should catch http status 200', (done) => {
      fetch
        .get('http://fake.com')
        .use({
          success: (response) => {
            try {
              assert.equal(response.ok, true);
              assert.equal(response.status, 200);
              done();
            } catch (e) {
              done(e);
            }
          }
        })

      let { xhr } = getFakeXhr();
      xhr.respond(200, { 'Content-Type': 'text/plain' }, 'error');
    })

    it('should catch http status 500', (done) => {
      fetch
        .get('http://fake.com')
        .use({
          success: (response) => {
            try {
              assert.equal(response.ok, false);
              assert.equal(response.status, 500);
              done();
            } catch (e) {
              done(e);
            }
          }
        })

      let { xhr } = getFakeXhr();
      xhr.respond(500, { 'Content-Type': 'text/plain' }, 'error');
    })

    it('should catch timeout', (done) => {
      fetch
        .get('http://fake.com', {
          timeout: 10
        })
        .use({
          error: (response, request) => {
            try {
              assert.equal(response.ok, false);
              // assert.equal(request._xhr._hasAborted, true);
              assert.equal(request._hasTimeout, true);
              assert.equal(request._hasAborted, true);
              done();
            } catch (e) {
              done(e);
            }
          }
        })
    })
  })
}
