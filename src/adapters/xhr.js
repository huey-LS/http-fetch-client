import Request from '../core/request';
import Response from '../core/response';

export default function ajax (request, options) {
  var method = request.getMethod();
  var headers = request.getHeaders();
  var body = request.getBodyStringify();
  var url = request.getURL();
  var async = request.async;
  var timeout = request.timeout;
  var responseType = request.responseType;

  var {
    onerror,
    onsuccess
  } = options;

  var xhr = createXMLHttpRequest();

  xhr.open(method, url, async);
  xhr.method = method;
  xhr.url = url;

  if (responseType) {
    xhr.responseType = responseType;
  }

  if (async && timeout > 0) {
    // setTimeout(() => {
    //   cancel(xhr, onerror, request);
    // }, timeout);
    xhr.timeout = timeout;
  }

  Object.keys(headers).forEach((key) => {
    xhr.setRequestHeader(key, headers[key]);
  });

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      xhr.end = true;
      if (xhr.status >= 200 && xhr.status < 300) {
        applyCallback(xhr, onsuccess);
      } else {
        applyCallback(xhr, onerror);
      }
    } else if (xhr.readyState < 2 && xhr.status > 0) {
      applyCallback(xhr, onerror);
    }
  }

  xhr.send(body);

  xhr._abort = xhr.abort;
  xhr.abort = createAbort(xhr, onerror, request);

  return xhr;
}

function createXMLHttpRequest () {
  var _g = (
    'undefined' !== typeof global
    ? global
    : 'undefined' !== typeof window
    ? window
    : null
  )
  if (_g && typeof _g.XMLHttpRequest !== 'undefined') {
    return new _g.XMLHttpRequest();
  } else {
    throw new Error('XMLHttpRequest not support')
  }
}

function applyCallback (xhr, callback) {
  typeof callback === 'function' &&
    callback(new Response({
      url: xhr.url,
      body: xhr.response || xhr.responseText,
      headers: xhr.getAllResponseHeaders(),
      method: xhr.method,
      status: xhr.status,
      readyState: xhr.readyState
    }))
}

function createAbort (xhr, onerror, request) {
  return function () {
    if (xhr.readyState !== 4 && !xhr.end) {
      xhr.end = true;
      xhr._abort();
      xhr.aborted = true;
      request.aborted = true;
      applyCallback(xhr, onerror);
    }
  }
}

function cancel (xhr, onerror, request) {
  if (xhr.readyState !== 4 && !xhr.end) {
    xhr.canceled = true;
    xhr.end = true;
    request.canceled = true;
    applyCallback(xhr, onerror);
  }
}
