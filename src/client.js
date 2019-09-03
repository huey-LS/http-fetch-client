import fetch from './fetch';
import Request from './core/request';
import Handles, { HandleCreator } from './handles';

export default class Client extends HandleCreator {
  constructor (options = {}) {
    super();
    if (options.adapter) {
      this._adapter = options.adapter;
    } else {
      this._adapter = fetch;
    }

    this.request = function (...args) {
      return request.call(this, ...args, this._adapter);
    }
    this.requestBind = this.request.bind(this);
    this.get = createBindMethod('GET', this.requestBind);
    this.post = createBindMethod('POST', this.requestBind);
    this.put = createBindMethod('PUT', this.requestBind);
    this.del = createBindMethod('DELETE', this.requestBind);
  }

  retry (request, handles) {
    var {
      handle,
      send
    } = requestWithoutSend(request, null, this._adapter);

    handle.use(handles);
    handle.catch(handles);

    send();

    return handle;
  }
}

export function requestWithoutSend (url, options, adapter = fetch) {
  var fetchRequest;
  if ('string' === typeof url) {
    fetchRequest = new Request({
      url,
      ...options
    });
  } else {
    fetchRequest = new Request(url);
  }

  var currentHandle;
  var ctx = {
    request: fetchRequest
  };

  if (this instanceof HandleCreator) {
    currentHandle = this.create();
  } else {
    currentHandle = new Handles();
  }

  function send () {
    currentHandle.start({
      ctx: ctx,
      type: 'beforeSend'
    });

    return adapter(fetchRequest)
      .then((response) => {
        ctx.response = response;
        return currentHandle.start({
          ctx: ctx,
          type: 'success'
        });
      }, (response) => {
        ctx.response = response;
        return currentHandle.start({
          ctx: ctx,
          type: 'error'
        });
      })
  }

  return {
    send,
    handle: currentHandle
  };
}

export function request (...args) {
  var {
    handle,
    send
  } = requestWithoutSend.call(this, ...args);

  send();

  return handle;
}

export const get = createBindMethod('GET');
export const post = createBindMethod('POST');
export const put = createBindMethod('PUT');
export const del = createBindMethod('DELETE');

function createBindMethod (method, requestFn = request) {
  return (url, options) => (
    requestFn(
      url,
      Object.assign({}, options, { method })
    )
  )
}
