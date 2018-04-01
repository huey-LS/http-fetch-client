import Request from '../core/request';
import Response from '../core/response';

export default function ajax (request, options) {
  var method = request.getMethod();
  var headers = request.getHeaders();
  var body = request.getBody();
  var url = request.getURL();
  var async = request.async;
  var timeout = request.timeout;

  var {
    onerror,
    onsuccess
  } = options;

  var xhr = createXMLHttpRequest();

  xhr.open(method, url, async);
  xhr.method = method;
  xhr.url = url;

  // if (responseType) {
  //   xhr.responseType = responseType;
  // }

  if (async && timeout > 0) {
    setTimeout(() => {
      cancel(xhr);
    }, timeout);
    xhr.timeout = timeout;
  }

  Object.keys(headers).forEach((key) => {
    xhr.setRequestHeader(key, headers[key]);
  });

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      xhr.end = true;
      if (xhr.status >= 200 && xhr.status < 300) {
        applyCallback(onsuccess, xhr);
      } else {
        applyCallback(onerror, xhr);
      }
    }
  }

  xhr.send(body);

  xhr._abort = xhr.abort;
  xhr.abort = abort(xhr, onerror);

  return xhr;
}

function createXMLHttpRequest () {
  return new XMLHttpRequest();
}

function applyCallback (xhr, callback) {
  typeof callback === 'function' &&
    callback(new Response({
      url: xhr.url,
      body: xhr.response,
      headers: xhr.getAllResponseHeaders,
      method: xhr.method
    }))
}

function abort (xhr, onerror) {
  if (xhr.readyState !== 4 && !xhr.end) {
    xhr.end = true;
    xhr._abort();
    xhr.aborted = true;
    applyCallback(xhr, onerror);
  }
}

function cancel (xhr) {
  if (xhr.readyState !== 4 && !xhr.end) {
    xhr.canceled = true;
    xhr.end = true;
  }
}
