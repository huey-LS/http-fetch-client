export default class Response {
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