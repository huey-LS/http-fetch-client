var assert = require('assert');

var getFakeXhr = require('./fake-xhr-creator').getFakeXhr;

module.exports = function (FetchClient) {
  describe('get', function () {
    let fetch = new FetchClient();
    let data = {'test': 'abc'};
    it('method is GET', () => {
      fetch.get('http://fake.com');

      let { xhr, respond } = getFakeXhr();
      assert.equal(xhr.method, 'GET')
      respond(200, { 'Content-Type': 'text/plain' }, '123');
    });

    it('request with query', () => {
      fetch
        .get('http://fake.com', {
          query: data
        });

      let { xhr } = getFakeXhr();
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
      assert.equal(xhr.url, 'http://fake.com?test=abc');
    })

    it('request with REST', () => {
      fetch
        .get('http://fake.com/{test}', {
          rest: data
        });

      let { xhr } = getFakeXhr();
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
      assert.equal(xhr.url, 'http://fake.com/abc');
    })

    // it('request body to url', () => {
    //   fetch
    //     .get('http://fake.com/{test}', {
    //       body: data
    //     });

    //   let { xhr } = getFakeXhr();
    //   assert.equal(xhr.requestBody, 'test=abc');
    //   assert.equal(xhr.url, 'http://fake.com/abc?test=abc');
    //   xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
    // })

    it('request query auto encodeURI', () => {
      fetch
        .get('http://fake.com', {
          query: { test: 'a&b' }
        });

      let { xhr } = getFakeXhr();
      assert.equal(xhr.url, 'http://fake.com?test=a%26b');
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
    })
  })
}
