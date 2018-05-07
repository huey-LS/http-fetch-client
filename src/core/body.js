import {
  alias
} from '../utils/decorators';
import {
  FORMAT_JSON,
  FORMAT_FORM,
  FORMAT_TEXT,
  FORMAT_FORM_DATA
} from '../utils/content-type';

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
/**
 *
 *
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
  constructor (body) {
    this._body = body;
  }

  format (type) {
    if (typeof this._body === 'string') {
      switch(type) {
        case FORMAT_TEXT:
          return this.text();
        case FORMAT_JSON:
          return this.json();
        case FORMAT_FORM:
          return this.form();
        case FORMAT_FORM_DATA:
          return this.formData();
        case 'blob':
          return this.blob();
      }

      return '';
    } else {
      return this._body;
    }
  }

  formatStringify (type) {
    switch(type) {
      case FORMAT_TEXT:
        return this.text();
      case FORMAT_JSON:
        return this.jsonStringify();
      case FORMAT_FORM:
        return this.formStringify();
      case FORMAT_FORM_DATA:
        return this.formData();
      case 'blob':
        return this.blob();
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
    if (typeof this._body === 'string') {
      return JSON.parse(this._body);
    } else {
      return this._body;
    }
  }

  @alias('jsonStringify')
  toJsonString () {
    return JSON.stringify(this._body);
  }

  /**
   *
   * @returns {String}
   * @memberof Body
   */
  @alias('form')
  toForm () {
    let body = this._body;
    if (typeof body === 'string') {
      return body.split('&').reduce((r, item) => {
        let arr = item.split('=');
        r[arr[0]] = typeof arr[1] === 'undefined' ? true : decodeURIComponent(arr[1]);
        return r;
      }, {})
    }
    return body;
  }

  @alias('formStringify')
  toFormString () {
    let body = this._body;
    if (!body) {
      return '';
    } else if (typeof body === 'string') {
      return body;
    } else {
      return Object.keys(body)
        .map((key) => `${key}=${encodeURIComponent(body[key])}`)
        .join('&');
    }
  }

  /**
   *
   * @returns {FormData}
   * @memberof Body
   */
  @alias('formData')
  toFormData () {
    let data = this.json();
    if (!data) {
      return '';
    } else if (typeof FormData === 'function') {
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
      return this.form();
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
   * @alias toString
   * @alias string
   * @returns {string}
   * @memberof Body
   */
  @alias('text')
  toText () {
    return this._body.toString();
  }
}
