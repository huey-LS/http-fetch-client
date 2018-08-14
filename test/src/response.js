var assert = require('assert');

var getFakeXhr = require('./fake-xhr-creator').getFakeXhr;

module.exports = function (FetchClient) {
  describe('response', function () {
    let fetch = new FetchClient();

    it('check body headers', (done) => {
      let responseTextData = 'test';
      fetch
        .get('http://fake.com')
        .use(({ response }) => {
          try {
            assert.equal(response.header.has('Content-Type'), true);
            assert.equal(response.header.get('Content-Type'), 'text/plain');
            done();
          } catch (e) {
            done(e);
          }
        });

      let { xhr } = getFakeXhr();
      xhr.respond(200, { 'Content-Type': 'text/plain' }, responseTextData);
    })

    it('output body to text', (done) => {
      let responseTextData = 'test';
      fetch
        .get('http://fake.com')
        .use(({ response }) => {
          try {
            assert.equal(response.getBody(), responseTextData);
            assert.equal(response.body.text(), responseTextData);
            done();
          } catch (e) {
            done(e);
          }
        });

      let { xhr } = getFakeXhr();
      xhr.respond(200, { 'Content-Type': 'text/plain' }, responseTextData);
    })

    it('output body to json', (done) => {
      let data = {'test': 'abc'};
      fetch
        .get('http://fake.com')
        .use(({ response }) => {
          try {
            assert.deepEqual(response.getBody(), data);
            assert.deepEqual(response.body.json(), data);
            done();
          } catch (e) {
            done(e)
          }
        });

      let { xhr } = getFakeXhr();
      xhr.respond(200, { 'Content-Type': 'text/json' }, JSON.stringify(data));
    })

    it('get promisify response ', (done) => {
      fetch
        .get('http://fake.com')
        .promisify()
        .then(({ response }) => {
          try {
            assert.deepEqual(response.ok, true);
            done();
          } catch (e) {
            done(e)
          }
        });

      let { xhr } = getFakeXhr();
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
    })

    it('get promisify response when error', (done) => {
      fetch
        .get('http://fake.com')
        .promisify()
        .then(
          () => {
            done(new Error('error'))
          }, () => {
            done();
          }
        );

      let { xhr } = getFakeXhr();
      xhr.respond(0, { 'Content-Type': 'text/plain' }, '');
    })

    it('get success promisify response with onlyWhenOk = true', (done) => {
      fetch
        .get('http://fake.com')
        .promisify({ onlyWhenOk: true })
        .then(({ response }) => {
          try {
            assert.deepEqual(response.ok, true);
            done();
          } catch (e) {
            done(e)
          }
        });

      let { xhr } = getFakeXhr();
      xhr.respond(200, { 'Content-Type': 'text/plain' }, '');
    })

    it('get failure promisify response with onlyWhenOk = true', (done) => {
      fetch
        .get('http://fake.com')
        .promisify({ onlyWhenOk: true })
        .then(
          () => {
            done(new Error('onlyWhenOk'))
          }, () => {
            done();
          }
        );

      let { xhr } = getFakeXhr();
      xhr.respond(300, { 'Content-Type': 'text/plain' }, '');
    })
  })
}