import fetch from './fetch';
import Request from './request';
import { HandleCreator } from './handles';

export default class Client {
  _globalHandle = new HandleCreator()
  use = this._globalHandle.use.bind(this._globalHandle);
  request = request
  requestBind = request.bind(this)
  get = createBindMethod('GET', this.requestBind)
  post = createBindMethod('POST', this.requestBind)
  put = createBindMethod('PUT', this.requestBind)
  del = createBindMethod('DELETE', this.requestBind)
}

export function requestWithoutSend (...args) {
  var fetchRequest = new Request(...args);

  var currentHandle;

  if (this instanceof Client && this._globalHandle instanceof HandleCreator) {
    currentHandle = this._globalHandle.create();
  } else {
    currentHandle = (new HandleCreator()).create();
  }

  currentHandle.start({
    value: [fetchRequest],
    type: 'beforeSend'
  });

  currentHandle.play({
    type: 'beforeSend'
  });

  function send () {
    return fetch(fetchRequest)
      .then(async (response) => {
        currentHandle.start({
          value: [response, fetchRequest],
          type: 'success'
        });
        await currentHandle.play({ type: 'success' });
        await currentHandle.play({ type: 'success', reverse: true });
      }, async (response) => {
        currentHandle.start({
          value: [response, fetchRequest],
          type: 'error'
        });
        await currentHandle.play({ type: 'error' });
        await currentHandle.play({ type: 'error', reverse: true });
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
