import fetch from './fetch';
import Request from './request';
import isGeneratorFunction from './is-generator-function';

class Handles {
  handleQueue = []
  catchHandleQueue = []
  playingHandles = {}
  _isEnd = {}

  constructor (handleQueue) {
    if (Array.isArray(handleQueue)) {
      handleQueue.forEach((handle) => { this.use(handle) })
    }
  }

  use (handle) {
    if (typeof handle === 'function') {
      this.handleQueue.push({ success: handle });
    } else {
      this.handleQueue.push(handle);
    }
    return this;
  }

  catch (handle) {
    this.catchHandleQueue.push(handle);
    return this;
  }

  start ({ value = [], type = 'success' } = {}) {
    let _self = this;
    let handleFns = this.handleQueue
      .filter((handle) => handle[type])
      .map((handle) => handle[type]);

    this.playingHandles[type] = handleFns.map((handle) => {
      if (isGeneratorFunction(handle)) {
        return handle.call(_self, ...value);
      } else {
        var currentFn = function * () { return handle.call(_self, ...value); }
        return currentFn();
      }
    });

    this._isEnd[type] = false;

    return this;
  }

  play = async ({ reverse, type = 'success' } = {}) => {
    var playingHandles = this.playingHandles[type];
    if (!playingHandles || this._isEnd[type]) return false;
    var i = 0;
    var len = playingHandles.length;
    for (; i < len; i++) {
      let index = reverse ? (len - i - 1) : i;
      try {
        let { done, value } = await playingHandles[index].next();
        // TODO
        await Promise.resolve(value);
        if (done) {
          playingHandles.splice(i, 1);
          i--;
          len--;
        }
      } catch (e) {
        this._isEnd[type] = true;
        this.playCatchHandle(e);
        return false;
      }
    }
    return true;
  }

  playCatchHandle = async (error) => {
    let catchHandleQueue = this.catchHandleQueue;
    let i = 0;
    let len = catchHandleQueue.length;
    for (; i < len; i++) {
      try {
        await catchHandleQueue[i](error);
      } catch (e) {}
    }
  }
}

class HandleCreator {
  handleQueue = []

  use (handle) {
    this.handleQueue.push(handle);
  }

  create () {
    return new Handles(this.handleQueue);
  }
}

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

export function request (...args) {
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

  fetch(fetchRequest)
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

  return currentHandle;
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
