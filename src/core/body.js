/**
 * enum for body type
 * @typedef BodyType
 * @type {'arraybuffer'|'blob'|'document'|'json'|'text'}
 */

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
  constructor (body, opts) {
    const { type } = opts;
    this._type = type;
    this._body = body;
    this.getBody = '';
  }

  /**
   * export json
   * @alias json
   * @returns {Object}
   * @memberof Body
   */
  toJson () {
    return JSON.parse(this._body);
  }
  json = this.toJson;

  /**
   *
   * @returns {FormData}
   * @memberof Body
   */
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
  toBlob (options) {
    if (Blob) {
      return new Blob([this._body], options);
    }
  }
  blob = this.toBlob;

  /**
   * @alias text
   * @alias string
   * @returns {string}
   * @memberof Body
   */
  toText () {
    return this._body;
  }
  toString = this.toText;
  text = this.toText;
}

/**
 *
 *
 * @param {any} data
 * @param {BodyType} type
 * @param {'text'|'json'} targetType
 */
function convert (data, type, targetType) {

}

function convertBlobToString (blob, cb) {
  const reader = new FileReader();

  reader.addEventListener('loadend', (e) => {
    const text = e.srcElement.result;
    if (typeof cb === 'function') cb(text);
  });

  reader.readAsText(blob);
}

function convertStringToBlob (str, { type }) {
  return new Blob([str], { type: type });
}

function convertArrayBufferToString (buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function convertStringToArrayBuffer (str) {
  var buf = new ArrayBuffer(str.length * 2);
  var bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
