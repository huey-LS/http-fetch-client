import URL from 'url-parse';
import Headers from './headers';
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
  constructor ({ url, method, headers, body }) {
    this.url = new URL(url);
    this.headers = new Headers(headers);
    this.body = new Body(body);
    this.setMethod(method || 'GET');
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
    return this.headers.get();
  }
  setHeaders (headers) {
    return this.headers.set(headers);
  }

  // alias get/set for body
  getBody () {
    return this.body.get();
  }
  setBody (body) {
    return this.body.set(body);
  }
}
