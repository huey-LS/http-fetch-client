import fetch, { Request } from './fetch';
import isGeneratorFunction from './isGeneratorFunction';

export { fetch, Request };

class Handles {
  handleQueue = []
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

  start ({ value = [], type = 'success' } = {}) {
    var handleFns = this.handleQueue
      .filter((handle) => handle[type])
      .map((handle) => handle[type]);

    this.playingHandles[type] = handleFns.map((handle) => {
      if (isGeneratorFunction(handle)) {
        return handle(...value);
      } else {
        var currentFn = function * () { return handle(...value); }
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
      var handleResult;
      try {
        handleResult = await playingHandles[index].next();
      } catch (e) {
        handleResult = { value: false };
      }
      if (handleResult.value === false) {
        this._isEnd[type] = true;
        return false;
      } else if (handleResult.done) {
        playingHandles.splice(i, 1);
        i--;
        len--;
      }
    }
    return true;
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

export default class Fetch {
  _globalHandle = new HandleCreator()
  request = request
  get = get
  post = post
  put = put
  del = del
}

export function request (...args) {
  var fetchRequest = new Request(...args);

  var currentHandle;

  if (this instanceof Fetch && this._globalHandle instanceof HandleCreator) {
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

export function get (url, options) {
  return request(
    url,
    Object.assign({}, options, { method: 'GET' })
  )
}

export function post (url, options) {
  return request(
    url,
    Object.assign({}, options, { method: 'POST' })
  )
}

export function put (url, options) {
  return request(
    url,
    Object.assign({}, options, { method: 'PUT' })
  )
}

// delete is a keyword
export function del (url, options) {
  return request(
    url,
    Object.assign({}, options, { method: 'DELETE' })
  )
}
