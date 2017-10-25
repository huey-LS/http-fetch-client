var sinon = require('sinon');

let xhr, fake;

exports.createFakeXhr = function () {
  before(function () {
    fake = sinon.useFakeXMLHttpRequest();
    fake.onCreate = function (_xhr) { xhr = _xhr; };
    global.XMLHttpRequest = fake;
  });
  after(function () {
    fake.restore();
  });
}

exports.getFakeXhr = function () {
  return {
    xhr,
    respond: (...args) => {
      xhr.respond(...args);
    }
  };
}
