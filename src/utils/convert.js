/**
 * enum for body type
 * @typedef BodyType
 * @type {'arraybuffer'|'blob'|'document'|'json'|'text'}
 */

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