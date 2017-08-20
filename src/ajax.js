export class AjaxRequest {
  constructor (url, options) {
    this._url = url;
    this._options = Object.assign({
      timeout: 20000,
      sendType: 'form',
      acceptType: 'json',
      async: true
    }, options);

    this.setHeaders();
  }

  getInitHeaders () {
    return {
      'Content-Type': (this._options.sendType === 'json'
        ? 'application/json; charset=UTF-8'
        : 'application/x-www-form-urlencoded; charset=UTF-8'),
      'Accept': (this._options.acceptType === 'json'
        ? 'application/json,text/javascript'
        : 'application/json,text/javascript')
    };
  }

  getHeaders () {
    return this._options.headers || {};
  }

  setHeaders (headers) {
    this._options.headers = Object.assign(this.getInitHeaders(), this._options.headers, headers);
  }

  getData () {
    return this._options.data || {};
  }

  getDataJson () {
    return JSON.stringify(this.getData());
  }

  getDataForm () {
    var data = this.getData();
    return Object.keys(data)
      .map((key) => `${key}=${encodeURIComponent(data[key])}`)
      .join('&');
  }

  getDataString () {
    switch (this._options.sendType) {
      case 'json':
        return this.getDataJson();

      default:
        return this.getDataForm();
    }
  }

  setData (newData) {
    this._options.data = Object.assign({}, this._options.data, newData);
  }

  getUrl () {
    return formatUrl(this._url, this.getData());
  }

  getUrlWithQuery () {
    var baseUrl = this.getUrl();
    var query = this.getQuery();
    query = query ? '?' + query : '';
    return `${baseUrl}${query}`;
  }

  getQuery () {
    var data = this.getData();
    return Object.keys(data).map((key) => {
      return `${key}=${data[key]}`;
    }).join('&');
  }

  getOptions () {
    return this._options;
  }

  setOptions (newOptions) {
    this._options = { ...this._options, ...newOptions };
    return this._options;
  }

  getMethod () {
    var { method } = this.getOptions();
    method = method.toUpperCase();
    return method;
  }
}

export class AjaxResponse {
  constructor (xhr, url, options) {
    this._xhr = xhr;
    this.options = options;
    this.url = url;
    this.headers = this.getHeaders();
    this.status = xhr.status;
    this.ok = xhr.status >= 200 && xhr.status < 300;
  }

  json () {
    var json;

    try {
      var responseText = this._xhr.responseText || this._xhr.response.toString();
      json = JSON.parse(responseText);
    } catch (e) {}

    return json;
  }

  blob (options) {
    options = Object.assign({type: ''}, options);
    var response = this._xhr.response;
    return new Blob([response], options);
  }

  getHeaders () {
    var responseHeaders = this._xhr.getAllResponseHeaders() || '';
    var headers = responseHeaders.split(/\n/).reduce((headers, headerString) => {
      let [key, val] = headerString.split(':');
      if (key) {
        headers[key.trim()] = val.trim();
      }
      return headers;
    }, {})

    return headers;
  }
}

export default class Ajax {
  constructor (url, options) {
    if (url instanceof AjaxRequest) {
      this._request = url;
    } else {
      this._request = new AjaxRequest(url, options);
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
      this.applyCallback(xhr, onerror, options);
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
      }, timeout)
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
    return new AjaxResponse(xhr, url, options);
  }

  applyCallback (callback, xhr, url, options) {
    typeof callback === 'function' &&
      callback(new AjaxResponse(xhr, url, options))
  }
}

function formatUrl (url, data) {
  if (typeof url !== 'string' || !data) return url;
  return url.replace(/\{(\w+)\}/g, function (searchValue, key) {
    if (typeof data[key] !== 'undefined') return data[key];
  });
}