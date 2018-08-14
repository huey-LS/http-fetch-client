var assert = require('assert');

var getFakeXhr = require('./fake-xhr-creator').getFakeXhr;

module.exports = function (FetchClient) {
  describe('global', () => {
    it('beforeSend set headers', () => {
      let fetch = new FetchClient();
      fetch
        .use({
          beforeSend: ({ request }) => {
            request.setHeaders({
              'X-Custom-Header': 'some'
            });
            request.header.append({
              'X-Custom-Header-Append': 'some'
            });
            request.header.append('X-Custom-Header-Append2', 'some');
          }
        });

      fetch.get('http://fake.com');

      let { xhr } = getFakeXhr();
      assert.equal(xhr.requestHeaders['X-Custom-Header'], 'some');
      assert.equal(xhr.requestHeaders['X-Custom-Header-Append'], 'some');
      assert.equal(xhr.requestHeaders['X-Custom-Header-Append2'], 'some');
      xhr.respond(200, { 'Content-Type': 'text/plain' }, 'test');
    })

    it('on success get body', (done) => {
      let fetch = new FetchClient();
      fetch
        .use({
          success: ({ response }) => {
            try {
              assert.equal(response.getBody(), 'test');
              assert.equal(response.body.text(), 'test');
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
          success: async function (ctx, next) {
            ctx._global_set = 'global';
            await next();
            try {
              assert.equal(ctx._use_set, 'use');
              done();
            } catch (e) {
              done(e)
            }
          }
        })

      fetch
        .get('http://fake.com')
        .use((ctx) => {
          ctx._use_set = 'use';
          try {
            assert.equal(ctx._global_set, 'global');
          } catch (e) {
            done(e)
          }
        });

      let { xhr } = getFakeXhr();
      xhr.respond(200, { 'Content-Type': 'text/plain' }, 'test');
    });

    it('can use array handle', (done) => {
      let fetch = new FetchClient();
      fetch.use([
        {
          'beforeSend': ({ request }) => {
            request.setHeaders({
              'X-Custom-Header': 'some'
            });
          }
        },
        function ({ response }) {
          try {
            assert.equal(response.body.text(), 'test');
            done();
          } catch (e) {
            done(e);
          }
        }
      ]);
      fetch.get('http://fake.com');
      let { xhr } = getFakeXhr();
      assert.equal(xhr.requestHeaders['X-Custom-Header'], 'some');
      xhr.respond(200, { 'Content-Type': 'text/plain' }, 'test');
    })

    it('should throw error of next called multiple', (done) => {
      let fetch = new FetchClient();
      fetch.use(
        async function (ctx, next) {
          try {
            await next();
            await next();
            done('not throw error');
          } catch (e) {
            done()
          }
        }
      );
      fetch.get('http://fake.com');
      let { xhr } = getFakeXhr();
      xhr.respond(200, { 'Content-Type': 'text/plain' }, 'test');
    })

    // it('use next not in async', (done) => {
    //   let fetch = new FetchClient();
    //   fetch.use([
    //     function (ctx, next) {
    //       next()
    //         .then((r) => {
    //           try {
    //             assert.equal(r, '1');
    //             done();
    //           } catch (e) {
    //             done(e)
    //           }
    //         });
    //     },
    //     function (ctx) {
    //       return '1';
    //     }
    //   ]);
    //   fetch.get('http://fake.com');
    //   let { xhr } = getFakeXhr();
    //   xhr.respond(200, { 'Content-Type': 'text/plain' }, 'test');
    // })
  })
}
