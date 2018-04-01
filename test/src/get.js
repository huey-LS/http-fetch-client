var assert = require('assert');

var getFakeXhr = require('./fake-xhr-creator').getFakeXhr;

module.exports = function (FetchClient) {
  describe('get', function () {
    let fetch = new FetchClient();
    let data = {'test': 'abc'};
    it('method is GET', () => {
      fetch.get('http://fake.com');

      let { xhr } = getFakeXhr();
      assert.equal(xhr.method, 'GET')
      console.log(xhr);
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
    });

    it('request body to query', () => {
      fetch
        .get('http://fake.com', {
          query: data
        });

      let { xhr } = getFakeXhr();
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
      assert.equal(xhr.requestBody, 'test=abc');
      assert.equal(xhr.url, 'http://fake.com?test=abc');
    })

    return 1;

    it('request body to url', () => {
      fetch
        .get('http://fake.com/{test}', {
          body: data
        });

      let { xhr } = getFakeXhr();
      assert.equal(xhr.requestBody, 'test=abc');
      assert.equal(xhr.url, 'http://fake.com/abc?test=abc');
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
    })

    it('request body to query with auto encodeURI', () => {
      fetch
        .get('http://fake.com', {
          body: { test: 'a&b' }
        });

      let { xhr } = getFakeXhr();
      assert.equal(xhr.requestBody, 'test=a%26b');
      assert.equal(xhr.url, 'http://fake.com?test=a%26b');
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
    })

    it('response body to text', (done) => {
      fetch
        .get('http://fake.com')
        .use((response) => {
          try {
            assert.equal(response.text(), 'test');
            done();
          } catch (e) {
            done(e);
          }
        });

      let { xhr } = getFakeXhr();
      xhr.respond(200, { 'Content-Type': 'text/plain' }, 'test');
    })

    it('response body to json', (done) => {
      fetch
        .get('http://fake.com')
        .use((response) => {
          try {
            assert.deepEqual(response.json(), data);
            done();
          } catch (e) {
            done(e)
          }
        });

      let { xhr } = getFakeXhr();
      xhr.respond(200, { 'Content-Type': 'text/plain' }, JSON.stringify(data));
    })
  })
}
