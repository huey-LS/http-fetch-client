export default class Handles {
  handleQueue = []
  catchHandleQueue = []

  constructor (handleQueue, catchHandleQueue) {
    this.use(handleQueue);
    this.catch(catchHandleQueue);
  }

  use = useNewHandles.bind(this)
  catch = catchNewHandles.bind(this)

  start ({ ctx = {}, type = 'success' } = {}) {
    let handleFns = this.handleQueue
      .filter((handle) => handle[type])
      .map((handle) => handle[type]);

    return this.play(handleFns)(ctx)
      .catch(this.playCatchHandle)
  }

  play = (middleware) => (ctx, next) => {
    let _self = this;
    let index = -1;
    return dispatch(0)
    function dispatch (i) {
      let fn = middleware[i];
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'))
      }
      index = i;
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      let value;
      try {
        value = fn.call(_self, ctx.response, ctx.request, () => {
          return dispatch(i + 1);
        });
      } catch (e) {
        return Promise.reject(e);
      }
      if (isPromise(value)) {
        return value;
      } else if (i === index) {
        return Promise.resolve(dispatch(i + 1));
      } else {
        return Promise.resolve(value);
      }
    }
  }

  playCatchHandle = async (error) => {
    let catchHandleQueue = this.catchHandleQueue;
    let i = 0;
    let len = catchHandleQueue.length;
    for (; i < len; i++) {
      await catchHandleQueue[i](error);
    }
  }
}

export class HandleCreator extends Handles {
  create () {
    return new Handles(this);
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

function catchNewHandles (handle) {
  let handles;
  if (handle) {
    if (handle instanceof Handles) {
      handles = handle.catchHandleQueue;
    } else if (Array.isArray(handle)) {
      handles = handle;
    } else if (typeof handle === 'function') {
      handles = [handle];
    }

    this.catchHandleQueue = [...this.catchHandleQueue, ...handles]
  }

  return this;
}

function isPromise (obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
