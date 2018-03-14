import Message from './message';

export default class Request extends Message {
  static sendTypeMap = {
    'json': 'application/json; charset=UTF-8',
    'form': 'application/x-www-form-urlencoded; charset=UTF-8'
  }

  static acceptTypeMap = {
    'json': 'application/json,text/javascript'
  }

  static defaultOptions = {
    timeout: 20000,
    sendType: 'form',
    acceptType: 'json',
    async: true
  }

  constructor (opts) {
    super(opts);
    this._options = opts;
    let initHeaders = this.getInitHeaders();
    this.setHeaders(initHeaders);
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
}

// function formatUrl (url, data) {
//   if (typeof url !== 'string' || !data) return url;
//   return url.replace(/\{(\w+)\}/g, function (searchValue, key) {
//     if (typeof data[key] !== 'undefined') return data[key];
//   });
// }
