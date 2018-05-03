function getDefaultAdapter (root) {
  var adapter;
  var _g = (
    'undefined' !== typeof window
    && window
  )
  if (_g && typeof _g.XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./xhr').default;
    console.log('adapter.js: use xhr');
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = require('./http').default;
    console.log('adapter.js: use http');
  }

  return adapter;
}

export default getDefaultAdapter();
