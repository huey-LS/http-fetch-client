import qs from 'querystringify';
import { FORMAT_TYPES } from './content-type';

/**
 * enum for body type
 * @typedef BodyType
 * @type {'arrayBuffer'|'blob'|'json'|'formData'}
 */

const objectToStringMap = {
  '[object ArrayBuffer]': 'arrayBuffer',
  '[object Blob]': 'blob',
  '[object FormData]': 'formData'
}

export const DATA_TYPE = {
  FORMAT_JSON: 'json',
  FORMAT_FORM: 'queryString',
  FORMAT_TEXT: 'string',
  FORMAT_FORM_DATA: 'formData',
  FORMAT_OCTET_STREAM: 'blob'
}

/**
 *
 * try convert to string or formData from object
 * @param {any} data
 * @param {BodyType} type
 */
export function stringify (data, type, options) {
  var originType;
  if (
    !type ||
    type === (originType = getType(data))
  ) return data;
  if (type === DATA_TYPE.FORMAT_JSON) {
    return convertJSONToString(data, options);
  } else if (type === DATA_TYPE.FORMAT_FORM_DATA) {
    return convertJSONToFormData(
      convertStringToJSON(data, options),
      options
    )
  } else if (type === DATA_TYPE.FORMAT_OCTET_STREAM) {
    return convertStringToBlob(
      convertJSONToString(
        convertFormDataToJSON(data, options),
        options
      ),
      options
    )
  } else if (type === DATA_TYPE.FORMAT_FORM) {
    return convertJSONToQueryString(
      convertFormDataToJSON(data, options),
      options
    )
  }
}

// try convert to object from string
export function parse (data, type, options) {
  var originType;

  if (
    !type ||
    type === (originType = getType(data))
  ) return data;
  if (type === DATA_TYPE.FORMAT_JSON) {
    return convertStringToJSON(data, options);
  } else if (type === DATA_TYPE.FORMAT_OCTET_STREAM) {
    return convertStringToBlob(data, options);
  } else if (type === DATA_TYPE.FORMAT_FORM) {
    return convertQueryStringToJSON(data, options);
  }
}

export function transferFormatType (formatType) {
  var key = Object.keys(FORMAT_TYPES).find((key) => (FORMAT_TYPES[key] === formatType));
  return DATA_TYPE[key];
}

export function getType (data) {
  var type = typeof data;

  if (type === 'object') {
    let t = Object.prototype.toString.call(data)
    if (objectToStringMap[t]) {
      type = objectToStringMap[t];
    }
  }

  return type;
}

export function convertBlobToStringAsync (blob, cb) {
  const reader = new FileReader();

  reader.addEventListener('loadend', (e) => {
    const text = e.srcElement.result;
    if (typeof cb === 'function') cb(text);
  });

  reader.readAsText(blob);
}

export function convertStringToBlob (str, { type }) {
  return new Blob([str], { type: type });
}

export function convertArrayBufferToString (buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

export function convertStringToArrayBuffer (str) {
  var buf = new ArrayBuffer(str.length * 2);
  var bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export function convertStringToJSON (str) {
  if (typeof str === 'string') {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  } else {
    return str;
  }
}

export function convertJSONToString (json) {
  if (typeof json !== 'string') {
    return JSON.stringify(json);
  } else {
    return json;
  }
}

export function convertJSONToFormData (json, { encode = true } = {}) {
  if (typeof FormData !== 'undefined') {
    return Object.keys(json)
      .reduce((formData, key) => {
        let _value = json[key];
        if (encode && typeof _value === 'string') {
          _value = encodeURIComponent(_value);
        }
        formData.append(key, _value);
        return formData;
      }, new FormData());
  }
}

export function convertFormDataToJSON (formData) {
  if (getType(formData) === 'formData') {
    var json = {};
    formData.forEach(function(value, key) {
      json[key] = value;
    });
    return json;
  } else {
    return formData;
  }
}

export function convertJSONToQueryString (json) {
  if (typeof json === 'string') {
    return json;
  }
  return qs.stringify(json);
}

export function convertQueryStringToJSON (str) {
  if (typeof str !== 'string') {
    return str;
  }
  return qs.parse(str);
}
