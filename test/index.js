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
    it('send get http request', function (done) {
      let fetch = new FetchClient();
      let data = {'test': 'abc'};
      fetch
        .get('http://fake.com', {
          data: data
        })
        .use((response, request) => {
          try {
            assert.equal(request.getMethod(), 'GET');
            assert.equal(response._xhr.method, 'GET');
            assert.equal(response._xhr.url, 'http://fake.com?test=abc');
            assert.equal(response.text(), 'test');
            done();
          } catch (e) {
            done(e)
          }
        });
      xhr.respond(200, { 'Content-Type': 'text/plain' }, 'test');
    })

    it('get json response', function (done) {
      let fetch = new FetchClient();
      fetch
        .get('http://fake.com')
        .use((response) => {
          try {
            assert.deepEqual(response.json(), {'test': 'abc'});
            done();
          } catch (e) {
            done(e)
          }
        });
      xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify({'test': 'abc'}));
    })
  })

  describe('post', function () {
    it('send post http request', function (done) {
      let fetch = new FetchClient();
      fetch
        .post('http://fake.com')
        .use((response, request) => {
          try {
            assert.equal(request.getMethod(), 'POST');
            assert.equal(response._xhr.method, 'POST');
            assert.equal(response.text(), 'test');
            done();
          } catch (e) {
            done(e)
          }
        })
      xhr.respond(200, { 'Content-Type': 'text/plain' }, 'test');
    })

    it('send post http request with json data', function (done) {
      let fetch = new FetchClient();
      let data = {'test': 'abc'};
      fetch
        .post('http://fake.com', {
          sendType: 'json',
          data: data
        })
        .use((response) => {
          try {
            assert.equal(response._xhr.requestHeaders['Content-Type'], 'application/json;charset=utf-8');
            assert.deepEqual(data, JSON.parse(response._xhr.requestBody))
            assert.deepEqual(response.json(), {'test': 'abc'});
            done();
          } catch (e) {
            done(e)
          }
        });
      xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify({'test': 'abc'}));
    })
  })

  describe('global', function () {
    it('test global', function (done) {
      let fetch = new FetchClient();
      fetch
        .use({
          beforeSend: (request) => {
            request.setHeaders({
              'X-Custom-Header': 'some'
            })
          },
          success: function * (response) {
            response._global_set = 'global';
            try {
              assert.equal(response.text(), 'test');
            } catch (e) {
              done(e)
            }
            yield;
            try {
              assert.equal(response._use_set, 'use');
              done();
            } catch (e) {
              done(e)
            }
          }
        });

      fetch
        .get('http://fake.com')
        .use((response, request) => {
          response._use_set = 'use';
          try {
            assert.equal(request.getHeaders()['X-Custom-Header'], 'some');
            assert.equal(response.text(), 'test');
            assert.equal(response._global_set, 'global');
          } catch (e) {
            done(e)
          }
        });
      xhr.respond(200, { 'Content-Type': 'text/plain' }, 'test');
    })
  })
});
