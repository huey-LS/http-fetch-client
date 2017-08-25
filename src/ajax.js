import Request from './request';
import Response from './response';

export default class Ajax {
  constructor (url, options) {
    if (url instanceof Request) {
      this._request = url;
    } else {
      this._request = new Request(url, options);
    }
  }

  createXMLHttpRequest () {
    return new XMLHttpRequest();
  }

  abort () {
    var xhr = this.xhr;
    if (xhr.readyState !== 4 && !this.end) {
      this.end = true;
      var options = this._request.getOptions();
      var onerror = options.onerror;
      xhr.abort();
      xhr._hasAbort = true;
      this.applyCallback(xhr, onerror, options);
    }
  }

  timeout () {
    var xhr = this.xhr;
    if (xhr.readyState !== 4 && !this.end) {
      xhr._hasTimeout = true;
      this.abort();
    }
  }

  send () {
    var options = this._request.getOptions();
    var method = this._request.getMethod();
    var headers = this._request.getHeaders();
    var url;
    if (method === 'GET') {
      url = this._request.getUrlWithQuery();
    } else {
      url = this._request.getUrl();
    }

    var {
      async,
      timeout,
      onerror,
      onsuccess,
      responseType
    } = options;

    var xhr = this.xhr = this.createXMLHttpRequest();

    xhr.open(method, url, async);

    if (responseType) {
      xhr.responseType = responseType;
    }

    if (async && timeout > 0) {
      setTimeout(() => {
        this.abort();
        // delete this.__timer;
      }, timeout);
      xhr.timeout = timeout;
    }

    Object.keys(headers).forEach((key) => {
      xhr.setRequestHeader(key, headers[key]);
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        this.end = true;
        if (xhr.status >= 200 && xhr.status < 300) {
          this.applyCallback(onsuccess, xhr, url, options);
        } else {
          this.applyCallback(onerror, xhr, url, options);
        }
      }
    }

    xhr.send(this._request.getDataString());
  }

  createResponse (xhr, url, options) {
    return new Response(xhr, url, options);
  }

  applyCallback (callback, xhr, url, options) {
    typeof callback === 'function' &&
      callback(new Response(xhr, url, options))
  }
}
