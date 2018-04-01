function getDefaultAdapter (root) {
  var adapter;
  var _g = (
    'undefined' !== typeof window
    && window
  )
  if (_g && typeof _g.XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./xhr').default;
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = require('./http').default;
  }

  return adapter;
}

export default getDefaultAdapter();
