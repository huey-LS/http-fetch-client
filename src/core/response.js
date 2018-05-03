import Message from './message';

export default class Response extends Message {
  constructor (opts) {
    super(opts);

    this.status = opts.status;
    this.readyState = opts.readyState;
    this.ok = opts.status >= 200 && opts.status < 300;
  }

  isTimeout () {
    return this.status === 408 || (this.readyState === 4 && this.status === 0);
    // return this._xhr._hasTimeout;
  }

  isAborted () {
    return this.status === 0 && this.readyState > 0
  }

  isConnectSuccess () {
    return this.readyState > 0
  }
}
