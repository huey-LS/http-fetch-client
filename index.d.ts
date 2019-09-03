declare interface Header {
  set (headers: Object): void;
  set (name: string, value: string): void;
  get (name: string): string;
  getAll(): Object;
  has (name: string): boolean;
  getContentFormatType (): string;
  toString(): string;
}

declare interface Body {
  json (): Object;
  jsonStringify (): string;
  text (): string;
  blob (): Object;
}

declare interface RESTURL {
  toString (): string;

}

declare class Message {
  url: RESTURL;
  header: Header;
  body: Body;
  setHeaders (headers: Object): void;
  getHeaders (): Header;
  getMethod (): string;
  setMethod (method: string): void;

  getURL (): string;
  getBody (): any;

}

export declare class Request extends Message {
  getRequestBody (): any;

  responseType?: string;
}

export declare class Response extends Message {
  constructor (options: {
    status: number;
    readyState: number;
    headers?: any;
    body?: any;
    url: string;
  });
  status: number;
  readyState: number;
  ok: boolean;
  isTimeout (): boolean;
  isAborted (): boolean;
  json(): Object;
  blob(): any;
  text(): string;
}

declare interface RequestContext {
  request: Request,
  response: Response
}

declare type AsyncNextFunction = () => Promise<any>;
// interface AsyncNextFunction {
//   (): Promise<any>;
// }
declare function middleware (requestContext: RequestContext, next: AsyncNextFunction): void|Promise<any>;

declare type middlewareType = typeof middleware;

// declare type middleware = (requestContext: RequestContext) => void|Promise<any>;
// declare type middleware = (requestContext: RequestContext, next: AsyncNextFunction) => Promise<any>;

// declare interface middleware {
//   (requestContext: RequestContext, next: AsyncNextFunction): Promise<any>;
//   (requestContext: RequestContext): void|Promise<any>;
// }

declare interface MiddlewareObject {
  beforeSend?: middlewareType,
  success?: middlewareType,
  error?: middlewareType
}

declare function customAdapter (request: Request): Promise<Response>;

declare interface PromisifyOptions {
  onlyWhenOk?: boolean
}

declare class HttpFetchClient {
  constructor (options?: { adapter: typeof customAdapter });
  use (callback: middlewareType|MiddlewareObject): HttpFetchClient;
  catch (callback: middlewareType): HttpFetchClient
  get (url: string, options?: Object): HttpFetchClient;
  post (url: string, options?: Object): HttpFetchClient;
  put (url: string, options?: Object): HttpFetchClient;
  del (url: string, options?: Object): HttpFetchClient;
  request (url: string, options?: Object): HttpFetchClient;
  promisify (options?: PromisifyOptions): Promise<RequestContext>
  retry (request: Request, handles: HttpFetchClient): HttpFetchClient
}

export default HttpFetchClient