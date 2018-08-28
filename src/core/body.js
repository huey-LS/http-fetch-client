import {
  alias
} from '../utils/decorators';

import {
  stringify,
  parse,
  transferFormatType,
  convertStringToBlob,
  convertStringToJSON,
  convertJSONToString,
  convertJSONToFormData,
  convertFormDataToJSON,
  convertJSONToQueryString,
  convertQueryStringToJSON
} from '../utils/convert';

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
    this.reset(body);
  }

  reset (body) {
    this._body = body;
    this.originBody = body;
  }

  write (formatType) {
    return stringify(this._body, transferFormatType(formatType))
  }

  read (formatType) {
    return parse(this._body, transferFormatType(formatType))
  }

  /**
   * export json
   * @alias json
   * @returns {Object}
   * @memberof Body
   */
  @alias('json')
  toJSON () {
    return convertStringToJSON(this._body);
  }

  @alias('jsonStringify')
  toJSONString () {
    return convertJSONToString(this._body);
  }

  /**
   *
   * @returns {String}
   * @memberof Body
   */
  @alias('form')
  toForm () {
    return convertQueryStringToJSON(this._body)
  }

  @alias('formStringify')
  toFormString () {
    return convertJSONToQueryString(this._body)
  }

  /**
   *
   * @returns {FormData}
   * @memberof Body
   */
  @alias('formData')
  toFormData () {
    return convertJSONToFormData(
      convertStringToJSON(this._body)
    )
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
      return convertStringToBlob(this._body, options);
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
    return convertJSONToString(
      convertFormDataToJSON(this._body)
    );
  }
}
