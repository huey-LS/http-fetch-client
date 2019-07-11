var assert = require('assert');

var getFakeXhr = require('./fake-xhr-creator').getFakeXhr;

module.exports = function (FetchClient) {
  describe('post', () => {
    let fetch = new FetchClient();
    let data = {'test': 'abc'};
    it('method is POST', () => {
      fetch.post('http://fake.com');

      let { xhr } = getFakeXhr();
      assert.equal(xhr.method, 'POST')
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
    });

    it('request with query', () => {
      fetch.post('http://fake.com', {
        query: { a: 1 }
      });

      let { xhr } = getFakeXhr();
      assert.equal(xhr.method, 'POST')
      assert.equal(xhr.url, 'http://fake.com?a=1');
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
    });

    it('request text body', () => {
      fetch
        .post('http://fake.com', {
          body: '123'
        });

      let { xhr } = getFakeXhr();
      assert.equal(xhr.requestBody.replace(/[\n\r]/g, ''), '123')
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
    })

    it('request form body', () => {
      fetch
        .post('http://fake.com', {
          body: data
        });

      let { xhr } = getFakeXhr();
      assert.equal(xhr.requestBody.replace(/[\n\r]/g, ''), 'test=abc')
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
    })

    it('request form body with auto encode ', () => {
      fetch
        .post('http://fake.com', {
          body: {'test': '/'}
        });

      let { xhr } = getFakeXhr();
      assert.equal(xhr.requestBody.replace(/[\n\r]/g, ''), 'test=%2F')
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
    })

    it('request json body', () => {
      fetch
        .post('http://fake.com', {
          body: data,
          headers: {
            'Content-Type': 'application/json'
          }
        });

      let { xhr } = getFakeXhr();
      assert.equal(xhr.requestBody, JSON.stringify(data));
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
    })

    it('check default request Content-Type', () => {
      fetch
        .post('http://fake.com', {
          body: ''
        });

      let { xhr } = getFakeXhr();
      assert.equal(xhr.requestHeaders['Content-Type'], 'application/x-www-form-urlencoded;charset=utf-8');
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
    })
  })
}