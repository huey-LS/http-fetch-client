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

declare class Message<T = any> {
  url: RESTURL;
  header: Header;
  body: Body;
  setHeaders (headers: Object): void;
  getHeaders (): Header;
  getMethod (): string;
  setMethod (method: string): void;

  getURL (): string;
  getBody (): T;

}

export declare class Request extends Message {
  getRequestBody (): any;

  responseType?: string;
}

export declare class Response<T = any> extends Message<T> {
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
  json(): T;
  blob(): any;
  text(): string;
}

declare interface RequestContext<ResBody = any> {
  request: Request,
  response: Response<ResBody>
}

declare type AsyncNextFunction = () => Promise<any>;
// interface AsyncNextFunction {
//   (): Promise<any>;
// }
declare function middleware<ResBody> (requestContext: RequestContext<ResBody>, next: AsyncNextFunction): void|Promise<any>;

declare type middlewareType = typeof middleware;

// declare type middleware = (requestContext: RequestContext) => void|Promise<any>;
// declare type middleware = (requestContext: RequestContext, next: AsyncNextFunction) => Promise<any>;

// declare interface middleware {
//   (requestContext: RequestContext, next: AsyncNextFunction): Promise<any>;
//   (requestContext: RequestContext): void|Promise<any>;
// }

declare interface MiddlewareObject<ResBody> {
  beforeSend?: middlewareType,
  success?: middlewareType<ResBody>,
  error?: middlewareType
}

declare function customAdapter (request: Request): Promise<Response>;

declare interface PromisifyOptions {
  onlyWhenOk?: boolean
}

declare class HttpFetchClient<ResBody = any> {
  constructor (options?: { adapter: typeof customAdapter });
  use<UseResBody = ResBody> (callback: middlewareType<UseResBody>|MiddlewareObject<UseResBody>): HttpFetchClient<UseResBody>;
  catch (callback: middlewareType): HttpFetchClient<ResBody>
  get<GetResBody = ResBody>  (url: string, options?: Object): HttpFetchClient<GetResBody>;
  post<PostResBody = ResBody>  (url: string, options?: Object): HttpFetchClient<PostResBody>;
  put<PutResBody = ResBody>  (url: string, options?: Object): HttpFetchClient<PutResBody>;
  del<DelResBody = ResBody>  (url: string, options?: Object): HttpFetchClient<DelResBody>;
  request<RequestResBody = ResBody> (url: string, options?: Object): HttpFetchClient<RequestResBody>;
  promisify<PromisifyResBody = ResBody>  (options?: PromisifyOptions): Promise<RequestContext<PromisifyResBody>>
  retry (request: Request, handles: HttpFetchClient<ResBody>): HttpFetchClient<ResBody>
}

export default HttpFetchClient