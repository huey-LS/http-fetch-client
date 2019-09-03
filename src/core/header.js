import {
  alias
} from '../utils/decorators';
import { getFormatType } from '../utils/content-type';

/**
 * Headers
 * @export
 * @class Headers
 */
export default class Header {
  /**
   * Creates an instance of Headers.
   * @param {string|Object} Header
   * @memberof Headers
   */
  constructor (headers) {
    this.originHeaders = headers;
    if (typeof headers === 'string') {
      this._headers = this.parse(headers);
    } else if (headers) {
      this._headers = { ...headers };
    } else if (!headers) {
      this._headers = {};
    }
  }

  parse (headers) {
    if (typeof headers === 'string') {
      return headers
        .split(/\r\n|\n/)
        .reduce((headers, header) => {
          let [ key, val ] = header.split(':');
          if (key && val) {
            headers[key.trim()] = val.trim();
          }
          return headers;
        }, {});
    } else {
      return headers;
    }
  }

  @alias('set')
  append (name, value) {
    if (typeof name === 'string' && value) {
      let newHeader = {};
      newHeader[name] = value;
      this._headers = Object.assign({}, this._headers, newHeader);
    } else {
      this._headers = Object.assign({}, this._headers, name);
    }
  }

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

  getContentFormatType () {
    return getFormatType(this.get('Content-Type'));
  }

  toString () {
    let headers = this.getAll();
    return headers.keys()
      .map((key) => (`${key}:${headers[key]}`))
      .join('\n');
  }
}
