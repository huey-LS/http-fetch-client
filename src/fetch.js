import Ajax, { AjaxRequest } from './ajax';

export const Request = AjaxRequest;

export default function fetch (...args) {
  var _resolve, _reject;
  var p = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  var ajax = new Ajax(...args);

  ajax._request.setOptions({
    onsuccess: function (response) {
      return _resolve(response);
    },

    onerror: function (response) {
      var { status } = response;
      if (status > 0) {
        return _resolve(response);
      } else {
        return _reject(response);
      }
    }
  })

  ajax.send();

  return p;
}
