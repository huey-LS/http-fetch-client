# request.js

```js
import request from 'request';

request(
  '/test',
  {
    method: 'GET',
    data: {}
  }
)
```

## use callback
```js
import request from 'request';

request(...).use((response) => {
  if (response.ok) {
    //  response.status in 200 - 300
  } else {
    //
  }
})
```

## global callback
```js
import request from 'request';

request.use((response) => {
  if (response.ok) {
    //  response.status in 200 - 300
  } else {
    //
  }
})
```

## async & promise support
```js
import request from 'request';

request.use(async (response) => {
  return await setTimeout(() => { console.log('first after 1000ms') }, 1000);
}).use((response) => {
  console.log('second')
})
// export
// first after 1000ms
// second;
```

## cyclic callback
```js
import request from 'request';

request.use(function * (response) {
  console.log('global start');
  yield true;
  console.log('global end');
});
request(...).use(function * (response) {
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

## other callback support ( beforeSend/error )
```js
import request from 'request';

request.use({
  beforeSend: (request) => {},
  error: (response, request) => {},
  success: (response, request) => {}
}));
// error: callback when network error (status === 0)
// beforeSend: before request send. not use like request(...).use
// success: status 1 - ...
```

## RestFull api
### get
```js
import { get } from 'request';

get(
  '/user/{id}',
  {
    data: {
      id: 1
    }
  }
)
```

### post
```js
import { post } from 'request';

get(
  '/user/create',
  {
    data: {
      name: 'a'
    }
  }
)
```

### put
```js
import { put } from 'request';

put(
  '/user/{id}',
  {
    data: {
      id: 1,
      name: 'b'
    }
  }
)
```

### del
```js
import { del } from 'request';

del(
  '/user/{id}',
  {
    data: {
      id: 1
    }
  }
)
```