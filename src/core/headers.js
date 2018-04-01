/**
 * Headers
 * @export
 * @class Headers
 */
export default class Headers {
  /**
   * Creates an instance of Headers.
   * @param {string|Object} headers
   * @memberof Headers
   */
  constructor (headers) {
    if (typeof headers === 'string') {
      this._headers = this.parse(headers);
    } else if (headers) {
      this._headers = { ...headers };
    } else if (!headers) {
      this._headers = {};
    }
  }

  parse (headersString) {
    if (typeof headersString === 'string') {
      return headersString
        .split(/\n/)
        .reduce((headers, headerString) => {
          let [key, val] = headerString.split(':');
          if (key && val) {
            headers[key.trim()] = val.trim();
          }
        }, {});
    }
  }

  append (name, value) {
    this._headers[name] = value;
  }
  set = this.append

  get (name) {
    if (name) {
      return this._headers[name];
    }
  }

  getAll () {
    return this._headers;
  }

  has (name) {
    return typeof this.get(name) !== 'undefined';
  }

  toString () {
    let headers = this.getAll();
    return headers.keys()
      .map((key) => (`${key}:${headers[key]}`))
      .join('\n');
  }
}
