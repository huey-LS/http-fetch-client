var assert = require('assert');
var sinon = require('sinon');
var FetchClient = require('../lib/index').default;

describe('xhr', function () {
  let xhr, fake;
  before(function () {
    fake = sinon.useFakeXMLHttpRequest();
    fake.onCreate = function (_xhr) { xhr = _xhr; };
    global.XMLHttpRequest = fake;
  });
  after(function () {
    fake.restore();
  });

  describe('get', function () {
    let fetch = new FetchClient();
    let data = {'test': 'abc'};
    it('method is GET', () => {
      fetch
        .get('http://fake.com')
      assert.equal(xhr.method, 'GET')
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
    });

    it('request body to query', () => {
      fetch
        .get('http://fake.com', {
          body: data
        })
      assert.equal(xhr.requestBody, 'test=abc');
      assert.equal(xhr.url, 'http://fake.com?test=abc');
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
            done(e)
          }
        })
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
        })
      xhr.respond(200, { 'Content-Type': 'text/plain' }, JSON.stringify(data));
    })
  })

  describe('post', () => {
    let fetch = new FetchClient();
    let data = {'test': 'abc'};
    it('method is POST', () => {
      fetch
        .post('http://fake.com')
      assert.equal(xhr.method, 'POST')
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
    });

    it('request form body', () => {
      fetch
        .post('http://fake.com', {
          body: data
        })
      assert.equal(xhr.requestBody.replace(/[\n\r]/g, ''), 'test=abc')
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
    })

    it('request json body', () => {
      fetch
        .post('http://fake.com', {
          body: data,
          sendType: 'json'
        })
      assert.equal(xhr.requestBody, JSON.stringify(data));
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
    })

    it('response body to text', (done) => {
      fetch
        .post('http://fake.com')
        .use((response) => {
          try {
            assert.equal(response.text(), 'test');
            done();
          } catch (e) {
            done(e)
          }
        })
      xhr.respond(200, { 'Content-Type': 'text/plain' }, 'test');
    })

    it('response body to json', (done) => {
      fetch
        .post('http://fake.com')
        .use((response) => {
          try {
            assert.deepEqual(response.json(), data);
            done();
          } catch (e) {
            done(e)
          }
        })
      xhr.respond(200, { 'Content-Type': 'text/plain' }, JSON.stringify(data));
    })
  })

  describe('global', function () {
    it('beforeSend set headers', () => {
      let fetch = new FetchClient();
      fetch
        .use({
          beforeSend: (request) => {
            request.setHeaders({
              'X-Custom-Header': 'some'
            })
          }
        });

      fetch
        .get('http://fake.com')
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

      fetch.get('http://fake.com')

      xhr.respond(200, { 'Content-Type': 'text/plain' }, 'test');
    });

    it('pass data between global and request', (done) => {
      let fetch = new FetchClient();
      fetch
        .use({
          success: function * (response) {
            response._global_set = 'global';
            yield;
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
      xhr.respond(200, { 'Content-Type': 'text/plain' }, 'test');
    });
  })
});
