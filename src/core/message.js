import URL from 'url-parse';
import Header from './header';
import Body from './body';

/**
 *
 *
 * @export
 * @class Message
 */
export default class Message {
  /**
   * Creates an instance of Message.
   * @param {any} opts
   * @param {string} opts.url
   * @param {string} opts.method
   * @param {any} opts.headers
   * @param {any} opts.body
   * @memberof Message
   */
  constructor (opts = {}) {
    const {
      url,
      method = 'GET',
      headers,
      query,
      body,
      rest,
      cache = false,
      interceptors
    } = opts;
    this.options = opts;
    this.url = new RESTURL(url);
    let currentQuery = query ? { ...query } : {};
    if (
      !cache
      && typeof currentQuery['_'] === 'undefined'
    ) {
      currentQuery._ = new Date().getTime();
    }
    this.url.set('query', currentQuery);

    if (rest) {
      this.url.rest = rest;
    }

    this.header = new Header(headers);
    this.body = new Body(body);
    this.interceptors = interceptors || {};
    this.setMethod(method);
  }

  getInterceptor (name) {
    if (name) return this.interceptors[name];
  }

  // alias get for url
  getMethod () {
    return this.method;
  }

  setMethod (method) {
    if (typeof method === 'string') {
      this.method = method.toUpperCase();
    }
  }

  // alias get for url
  getURL () {
    return this.url.toString();
  }

  // alias get/set for headers
  getHeaders () {
    return this.header.getAll();
  }
  setHeaders (headers) {
    return this.header.set(headers);
  }

  // alias get/set for body
  getBody () {
    let formatType = this.header.getContentFormatType();
    return this.body.read(formatType);
  }
}

export class RESTURL extends URL {
  RESTRegexp = /{(\w+)}/g;

  toString () {
    if (this.rest) {
      let pathname = this.pathname;
      let RESTData = this.rest;
      let currentPathname = pathname.replace(this.RESTRegexp, (s, s1) => {
          if (typeof RESTData[s1] !== 'undefined') {
            return RESTData[s1];
          } else {
            return s;
          }
        })

      return URL.prototype.toString.call(Object.assign({}, this, {
        pathname: currentPathname
      }))
    } else {
      return URL.prototype.toString.call(this);
    }
  }
}
