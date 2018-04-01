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
    type: 'form',
    accept: 'json',
    async: true
  }

  constructor (opts) {
    opts = format(opts)
    super(opts);
    this.async = opts.async;
    this.timeout = opts.timeout;
  }
}

function format (opts) {
  let newOpts = {
    ...Request.defaultOptions,
    ...opts
  };
  newOpts.headers = {
    ...getInitHeaders(newOpts),
    ...newOpts.headers
  };
  return newOpts;
}

function getInitHeaders ({
  type = 'form',
  accept = 'form'
}) {
  let initHeaders = {};
  let contentType = Request.sendTypeMap[type];
  if (contentType) {
    initHeaders['Content-Type'] = contentType;
  }

  let acceptType = Request.acceptTypeMap[accept];
  if (acceptType) {
    initHeaders['Accept'] = acceptType;
  }
  return initHeaders;
}

// function formatUrl (url, data) {
//   if (typeof url !== 'string' || !data) return url;
//   return url.replace(/\{(\w+)\}/g, function (searchValue, key) {
//     if (typeof data[key] !== 'undefined') return data[key];
//   });
// }
