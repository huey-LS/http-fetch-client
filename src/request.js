export default class Request {
  static sendTypeMap = {
    'json': 'application/json; charset=UTF-8',
    'form': 'application/x-www-form-urlencoded; charset=UTF-8'
  }

  static acceptTypeMap = {
    'json': 'application/json,text/javascript'
  }

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
    let initHeaders = {};
    let contentType = Request.sendTypeMap[this._options.sendType];
    if (contentType) {
      initHeaders['Content-Type'] = contentType;
    }

    let accept = Request.acceptTypeMap[this._options.acceptType];
    if (accept) {
      initHeaders['Accept'] = accept;
    }
    return initHeaders;
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

  getDataFormData () {
    var data = this.getData();
    var formData = new FormData();

    Object.keys(data)
      .forEach((key) => {
        let _value = data[key];
        if (typeof _value === 'string') {
          _value = encodeURIComponent(_value);
        }
        formData.append(key, _value);
      })

    return formData;
  }

  getDataString () {
    switch (this._options.sendType) {
      case 'json':
        return this.getDataJson();

      case 'formData':
        return this.getDataFormData();

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
