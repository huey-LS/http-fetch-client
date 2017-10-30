# http-fetch-client.js
[![](https://img.shields.io/travis/ignous/http-fetch-client.svg)](https://travis-ci.org/ignous/http-fetch-client)
[![npm version](https://img.shields.io/npm/v/http-fetch-client.svg?maxAge=3600)](https://www.npmjs.org/package/http-fetch-client)
[![npm download](https://img.shields.io/npm/dm/http-fetch-client.svg?maxAge=3600)](https://www.npmjs.org/package/http-fetch-client)

浏览器端 fetch client 类， 和一般的fetch不一样哦

其他语言的README: [简体中文](README.md), [English](README.es.md)

## 安装
```
npm install --save http-fetch-client
```

## 用法
发送一个GET请求
```js
import FetchClient from 'http-fetch-client';

let fetch = new FetchClient();
fetch.request(
  '/test',
  {
    method: 'GET',
    body: {}
  }
)
```

### 以中间件方式实现回调
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

### 添加全局中间件，处理事物
创建后每次调用`request/get/post/del/pull`请求都会进入

PS: 注意，这里是`fetch.use` 而非 `fetch.request(...).use`

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

### 支持 `async` & `promise` 的中间件～
- 使用`promise`

PS: Promise reject 会停止后续中间件执行
```js
import FetchClient from 'http-fetch-client';

let fetch = new FetchClient();
fetch.request(...).use((response) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('first after 1000ms');
      resolve();
    }, 1000);
  })
}).use((response) => {
  console.log('second')
})
// console
// first after 1000ms
// second;
```

- 使用`async`
```js
import FetchClient from 'http-fetch-client';

let fetch = new FetchClient();
fetch.request(...).use(async (response) => {
  return await setTimeout(() => {
    console.log('first after 1000ms');
  }, 1000);
}).use((response) => {
  console.log('second')
})
// console
// first after 1000ms
// second;
```

### 通过generators实现 中间件级联
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
// console
// global start
// request start
// request end
// global end
```

### 停止后续的中间件执行
只需要返回`Promise.reject()`
```js
import FetchClient from 'http-fetch-client';

let fetch = new FetchClient();
fetch.request(...).use(function (response) {
  console.log('first');
  return Promise.reject();
});
fetch.request(...).use(function (response) {
  console.log('second');
});
// console
// first
```

### 其他周期的中间件支持 ( beforeSend/error/success )
- beforeSend 发送前，只有全局中间件能起效
- success 默认项 成功返回了结果 `status !== 0`
- error `status === 0` 网络错误时候
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
```

### GET/POST/PUT/DEL RESTful的请求方式
```js
import FetchClient from 'http-fetch-client';

let fetch = new FetchClient();
fetch.get(url[, options])
fetch.post(url[, options])
fetch.put(url[, options])
fetch.del(url[, options])
```
等价于
```js
fetch.request(url, { method: 'GET'||'POST'||'PUT'||'DELETE'})
```


## Response
### Method
- text/json/blob
对返回的内容进行格式化
```js
fetch.get(...).use((response) => {
  console.log(response.text()) // String: test
  console.log(response.json()) // Object: {a:'..'}
})
```
- getHeaders
返回response headers
- isTimeout 返回是否超时
- isAborted 返回是否取消

### Attribute
- status {Number} http状态
- ok {Boolean} http状态在200-300中间

## Request
```js
import { Request } from 'http-fetch-client';
new Request(url, options);
```

### Method
- getHeaders 获取请求头
- setHeaders 设置请求头
- getBody/getBodyForm/getBodyJson/getBodyFormData 获取请求body， 并转化为某种格式
- setBody 设置请求body
- getUrl/getUrlWithQuery(for GET) 获取url
- getOptions 获取 options
- setOptions 设置 options
- getMethod 获取 method

### Options Attribute
- sendType {String} 发送的数据格式，支持 json/form(default)，设置会会自动添加header中的 `Content-Type`
``` js
{
  'json': 'application/json; charset=UTF-8', // default
  'form': 'application/x-www-form-urlencoded; charset=UTF-8'
}
```

- acceptType {String} 接受的数据格式，支持 json(default)，设置会会自动添加header中的 `Accept`
``` js
{
  'json': 'application/json,text/javascript' // default
}
```

- async {Boolean}
- body|data {Object}
- headers {Object}

PS: no callback to onsuccess or onerror

## 例子
待丰富
[https://github.com/ignous/http-fetch-client-examples](https://github.com/ignous/http-fetch-client-examples)
