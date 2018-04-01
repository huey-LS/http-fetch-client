import fetch from './fetch';
import Request from './core/request';
import Handles, { HandleCreator } from './handles';

export default class Client extends HandleCreator {
  // _globalHandle = new HandleCreator()
  // use = this._globalHandle.use.bind(this._globalHandle);
  // catch = this._globalHandle.catch.bind(this._globalHandle);
  request = request
  requestBind = request.bind(this)
  get = createBindMethod('GET', this.requestBind)
  post = createBindMethod('POST', this.requestBind)
  put = createBindMethod('PUT', this.requestBind)
  del = createBindMethod('DELETE', this.requestBind)
}

export function requestWithoutSend (url, options) {
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

  currentHandle.start({
    ctx: ctx,
    type: 'beforeSend'
  });

  function send () {
    return fetch(fetchRequest)
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
