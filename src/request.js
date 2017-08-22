export default class Request {
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
    this._options.headers = Object.assign({}, this.getInitHeaders(), this._options.headers, headers);
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
    this._options = Object.assign({}, this._options, newOptions);
    return this._options;
  }

  getMethod () {
    var { method } = this.getOptions();
    method = method.toUpperCase();
    return method;
  }
}

function formatUrl (url, data) {
  if (typeof url !== 'string' || !data) return url;
  return url.replace(/\{(\w+)\}/g, function (searchValue, key) {
    if (typeof data[key] !== 'undefined') return data[key];
  });
}
