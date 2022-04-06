var chai = require('chai');

var getFakeXhr = require('./fake-xhr-creator').getFakeXhr;

var expect = chai.expect;

module.exports = function (FetchClient) {
  describe('interceptors', function () {
    let fetch = new FetchClient();
    it('interceptors.xhr', () => {
      fetch.get('http://fake.com/', {
        interceptors: {
          xhr: function (xhr) {
            xhr.withCredentials = true;
            xhr.method = 'POST';
          }
        }
      });

      let { xhr, respond } = getFakeXhr();
      respond(200, { 'Content-Type': 'text/plain' }, '123');
      expect(xhr.method).to.equal('POST');
      expect(xhr.withCredentials).to.equal(true);
    });
  })
}
