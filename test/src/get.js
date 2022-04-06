var chai = require('chai');

var getFakeXhr = require('./fake-xhr-creator').getFakeXhr;

var expect = chai.expect;

module.exports = function (FetchClient) {
  describe('get', function () {
    let fetch = new FetchClient();
    let data = {'test': 'abc'};
    it('method is GET', () => {
      fetch.get('http://fake.com');

      let { xhr, respond } = getFakeXhr();
      expect(xhr.method).to.equal('GET');
      respond(200, { 'Content-Type': 'text/plain' }, '123');
    });

    it('request with query', () => {
      fetch
        .get('http://fake.com', {
          query: data
        });

      let { xhr } = getFakeXhr();
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
      expect(xhr.url).to.match(/^http:\/\/fake.com\/\?test=abc&_=[0-9]+$/);
    })

    it('request with REST', () => {
      fetch
        .get('http://fake.com/{test}', {
          rest: data
        });

      let { xhr } = getFakeXhr();
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
      expect(xhr.url).to.match(/^http:\/\/fake.com\/abc\?_=[0-9]+$/);
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
      expect(xhr.url).to.match(/^http:\/\/fake.com\/\?test=a%26b&_=[0-9]+$/);
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
    })
  })
}
