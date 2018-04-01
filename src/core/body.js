import {
  alias
} from './utils/decorators';

/**
 * Body constructor options
 * @typedef BodyOptions
 * @type {Object}
 * @property {BodyType} type
*/

/**
 * body
 * @export
 * @class Body
 */
export default class Body {
  /**
   * Creates an instance of Body.
   * @param {any} body
   * @param {BodyOptions} opts
   * @memberof Body
   */
  constructor (body, opts = {}) {
    const { type = 'text' } = opts;
    this._type = type;
    this._body = body || '';
  }

  format () {
    const type = this._type;
    switch(type) {
      case 'text':
        return this.text()
      case 'json':
        return this.json()
      case 'form':
        return this.form()
      case 'blob':
        return this.blob()
    }

    return '';
  }

  /**
   * export json
   * @alias json
   * @returns {Object}
   * @memberof Body
   */
  @alias('json')
  toJSON () {
    return JSON.parse(this._body);
  }

  /**
   *
   * @returns {FormData}
   * @memberof Body
   */
  @alias('form')
  toFormData () {
    let data = this.toJson();

    if (FormData) {
      let formData = new FormData();
      return Object.keys(data)
        .reduce((formData, key) => {
          let _value = data[key];
          if (typeof _value === 'string') {
            _value = encodeURIComponent(_value);
          }
          formData.append(key, _value);
          return formData;
        }, formData);
    } else {
      return Object.keys(data)
        .map((key) => `${key}=${encodeURIComponent(data[key])}`)
        .join('&');
    }
  }

  /**
   * @alias blob
   * @param {any} options
   * @returns {Blob}
   * @memberof Body
   */
  @alias('blob')
  toBlob (options) {
    if (Blob) {
      return new Blob([this._body], options);
    }
  }

  /**
   * @alias text
   * @alias string
   * @returns {string}
   * @memberof Body
   */
  @alias('toString', 'text')
  toText () {
    return this._body.toString();
  }
}
