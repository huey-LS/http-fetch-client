var sinon = require('sinon');

let xhr, fake;

exports.createFakeXhr = function () {
  before(function () {
    sinon.xhr.supportsTimeout = true;
    setInterval.clock = {}
    Date.clock = {}
    fake = sinon.useFakeXMLHttpRequest();
    fake.onCreate = function (_xhr) {
      xhr = _xhr;
    };
    // console.log(sinon.xhr.supportsTimeout)
    global.window.XMLHttpRequest = fake;
  });
  after(function () {
    fake.restore();
  });
}

exports.getFakeXhr = function () {
  return {
    xhr,
    respond: (...args) => {
      setTimeout(() => {
        xhr.respond(...args);
      }, 1)
    }
  };
}
