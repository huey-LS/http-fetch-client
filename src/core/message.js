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
  constructor ({
    url,
    method = 'GET',
    headers,
    query,
    body,
    type
  }) {
    this.url = new URL(url);
    if (query) {
      this.url.set('query', query);
    }
    this.header = new Header(headers);
    this.body = new Body(body);
    this.setMethod(method);
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
