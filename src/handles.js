import isGeneratorFunction from './is-generator-function';
export default class Handles {
  handleQueue = []
  catchHandleQueue = []
  playingHandles = {}
  _isEnd = {}

  constructor (handleQueue) {
    this.use(handleQueue);
  }

  use = useNewHandles.bind(this)

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

export class HandleCreator {
  handleQueue = []

  use = useNewHandles.bind(this);

  create () {
    return new Handles(this.handleQueue);
  }
}

function useNewHandles (handle) {
  let handles;
  if (handle) {
    if (handle instanceof Handles) {
      handles = handle.handleQueue;
    } else if (Array.isArray(handle)) {
      handles = handle;
    } else if (typeof handle === 'function') {
      handles = [{ success: handle }];
    } else {
      handles = [handle];
    }

    this.handleQueue = [...this.handleQueue, ...handles]
  }

  return this;
}
