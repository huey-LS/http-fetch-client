import Message from './message';

export default class Response extends Message {
  constructor (opts) {
    super(opts);

    this.status = opts.status;
    this.ok = opts.status >= 200 && opts.status < 300;
  }

  isTimeout () {
    return this._xhr._hasTimeout;
  }

  isAborted () {
    return this._xhr._hasAborted;
  }
}
