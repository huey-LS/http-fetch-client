# http-fetch-client.js
[![](https://img.shields.io/travis/ignous/http-fetch-client.svg)](https://travis-ci.org/ignous/http-fetch-client)
[![npm version](https://img.shields.io/npm/v/http-fetch-client.svg?maxAge=3600)](https://www.npmjs.org/package/http-fetch-client)

a fetch client for browser

## Installation
```
npm install --save http-fetch-client
```

## examples
[https://github.com/ignous/http-fetch-client-examples](https://github.com/ignous/http-fetch-client-examples)

## Usage
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

### with callback
```js
import FetchClient from 'http-fetch-client';

let fetch = new FetchClient();
fetch.request(...).use((response) => {
  if (response.ok) {
    //  response.status in 200 - 300
  } else {
    //
  }
})
```

### global callback
```js
import FetchClient from 'http-fetch-client';

let fetch = new FetchClient();
fetch.use((response) => {
  if (response.ok) {
    //  response.status in 200 - 300
  } else {
    //
  }
})
```

### async & promise support
```js
import FetchClient from 'http-fetch-client';

let fetch = new FetchClient();
fetch.request(...).use(async (response) => {
  return await setTimeout(() => { console.log('first after 1000ms') }, 1000);
}).use((response) => {
  console.log('second')
})
// export
// first after 1000ms
// second;
```

### cyclic callback
```js
import FetchClient from 'http-fetch-client';

let fetch = new FetchClient();
fetch.use(function * (response) {
  console.log('global start');
  yield true;
  console.log('global end');
});
fetch.request(...).use(function * (response) {
  console.log('request start');
  yield true;
  console.log('request end');
});
// export
// global start
// request start
// request end
// global end
```

### other callback support ( beforeSend/error )
```js
import FetchClient from 'http-fetch-client';

let fetch = new FetchClient();
fetch.use({
  beforeSend: (request) => {
    request.setHeaders({
      'X-Custom-Header': 'some'
    })
  },
  error: (response, request) => {
    // ...
  },
  success: (response, request) => {
    // ...
  }
}));
// error: callback when network error (status === 0)
// beforeSend: before request send. not use like request(...).use
// success: status 1 - ...
```

### Request method aliases
```js
import FetchClient from 'http-fetch-client';

let fetch = new FetchClient();
fetch.get(url[, options])
fetch.post(url[, options])
fetch.put(url[, options])
fetch.del(url[, options])
```
