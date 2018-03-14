import * as http from 'http';
import Request from '../core/request';
import Response from '../core/response';

export default function request (opts) {
  let request = new Request(opts);
  let {
    onerror,
    onsuccess
  } = opts;

  const options = {
    ...request.getURL(),
    method: request.getMethod(),
    headers: request.getHeaders()
  };

  let body = request.getBody();

  const clientRequest = http.request(options, (res) => {
    res.setEncoding('utf8');
    var data = '';
    res.on('data', (chunk) => {
      data += chunk.toString();
    });
    res.on('end', () => {
      applyCallback(onsuccess, res, data);
    });
  });

  clientRequest.on('error', (e) => {
    applyCallback(onerror, clientRequest, e);
  });

  // write data to request body
  clientRequest.write(body);
  clientRequest.end();

  return clientRequest;
}

function applyCallback (callback, res, data) {
  typeof callback === 'function' &&
    callback(new Response({
      url: res.url,
      body: data,
      headers: res.headers,
      method: res.method,
      status: res.statusCode
    }))
}
