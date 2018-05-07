# http-fetch-client.js
[![](https://img.shields.io/travis/ignous/http-fetch-client.svg)](https://travis-ci.org/ignous/http-fetch-client)
[![npm version](https://img.shields.io/npm/v/http-fetch-client.svg?maxAge=3600)](https://www.npmjs.org/package/http-fetch-client)
[![npm download](https://img.shields.io/npm/dm/http-fetch-client.svg?maxAge=3600)](https://www.npmjs.org/package/http-fetch-client)
[![codecov](https://codecov.io/gh/ignous/http-fetch-client/branch/master/graph/badge.svg)](https://codecov.io/gh/ignous/http-fetch-client)

a fetch client for browser

Read this in other languages: [简体中文](README.md), [English](README.es.md)

## Installation
```
npm install --save http-fetch-client
```

## Usage
send a request
```js
import FetchClient from 'http-fetch-client';

let fetch = new FetchClient();
fetch.request(
  '/test',
  {
    method: 'GET',
    data: {}
  }
)
```

### use middleware replace callback
```js
import FetchClient from 'http-fetch-client';

let fetch = new FetchClient();
fetch.request(...).use(({ response }) => {
  if (response.ok) {
    //  response.status in 200 - 300
  } else {
    //
  }
})
```

### set global middleware
global middleware will be called on every request

PS: global middleware is `fetch use` not `fetch.request(...).use`
```js
import FetchClient from 'http-fetch-client';

let fetch = new FetchClient();
fetch.use(({ response }) => {
  if (response.ok) {
    //  response.status in 200 - 300
  } else {
    //
  }
})
```

### middleware support async & promise
```js
import FetchClient from 'http-fetch-client';

let fetch = new FetchClient();
fetch.request(...).use(async ({ response, request }, next) => {
  await setTimeout(() => { console.log('first after 1000ms') }, 1000);
  return next();
}).use((response) => {
  console.log('second')
})
// console
// first after 1000ms
// second;
```

### middleware cascade
```js
import FetchClient from 'http-fetch-client';

let fetch = new FetchClient();
fetch.use(async function({ response, request }, next) {
  console.log('global start');
  await next();
  console.log('global end');
});
fetch.request(...).use(async function ({ response, request }, next) {
  console.log('request start');
  await next();
  console.log('request end');
});
// console
// global start
// request start
// request end
// global end
```

### stop next middleware
return `Promise` or use `async function` without run `next()`
```js
import FetchClient from 'http-fetch-client';

let fetch = new FetchClient();
fetch.request(...).use(async function ({ response }) {
  console.log('first');
});
fetch.request(...).use(function ({ response }) {
  console.log('second');
});
// console
// first
```

### other cycle support ( beforeSend/error/success )
- beforeSend: before request send. only global middleware
- error: be called when network error (status === 0)
- success: status 1 - ...

```js
import FetchClient from 'http-fetch-client';

let fetch = new FetchClient();
fetch.use({
  beforeSend: ({ request }) => {
    request.header.set('X-Custom-Header', 'some');
  },
  error: ({ response, request }) => {
    // ...
  },
  success: ({ response, request }) => {
    // ...
  }
}));
```

### REATful api
```js
import FetchClient from 'http-fetch-client';

let fetch = new FetchClient();
fetch.get(url[, options])
fetch.post(url[, options])
fetch.put(url[, options])
fetch.del(url[, options])
```


## Response
### Method
- text/json/blob
return formated body
```js
fetch.get(...).use(({ response }) => {
  console.log(response.getBody()) // auto format by Content-Type in response's header
  console.log(response.text()) // String: test
  console.log(response.json()) // Object: {a:'..'}
})
```
- getHeaders
return response headers
- isTimeout
- isAborted

### Attribute
- status {Number} http status
- ok {Boolean} status >= 200 & status < 300

## Request
```js
import { Request } from 'http-fetch-client';
new Request(url, options);
```

### Method
- getHeaders
- setHeaders
- getBody/getBodyForm/getBodyJson/getBodyFormData
- setBody
- getUrl/getUrlWithQuery(for GET)
- getOptions
- setOptions
- getMethod

### Options Attribute
- sendType {String} quick set `Content-Type` in headers.
support:
``` js
{
  'json': 'application/json; charset=UTF-8', // default
  'form': 'application/x-www-form-urlencoded; charset=UTF-8'
}
```

- acceptType {String} quick set `accept` in headers.
support:
``` js
{
  'json': 'application/json,text/javascript' // default
}
```

- async {Boolean}
- body|data {Object}
- headers {Object}

PS: no callback to onsuccess or onerror

## examples
[https://github.com/ignous/http-fetch-client-examples](https://github.com/ignous/http-fetch-client-examples)
