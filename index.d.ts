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

export declare interface MessageOption {
  url: string;

  method?: 'GET' | 'POST',

  headers?: {
    [key: string]: string
  };

  query?: {
    [key: string]: any
  };

  body?: any;

  rest?: any;
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

export declare interface RequestOption extends MessageOption {
  encode?: boolean;
  async?: boolean;
  timeout?: number;
  responseType?: string;
  bodyFormatType?: string;
}

export declare class Request extends Message {
  constructor (options: RequestOption);
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

// declare type middlewareType<ResBody> = typeof middleware<ResBody>;
declare interface middlewareType<ResBody> {
  (requestContext: RequestContext<ResBody>, next: AsyncNextFunction): void|Promise<any>;
}

// declare type middleware = (requestContext: RequestContext) => void|Promise<any>;
// declare type middleware = (requestContext: RequestContext, next: AsyncNextFunction) => Promise<any>;

// declare interface middleware {
//   (requestContext: RequestContext, next: AsyncNextFunction): Promise<any>;
//   (requestContext: RequestContext): void|Promise<any>;
// }

declare interface MiddlewareObject<ResBody> {
  beforeSend?: middlewareType<ResBody>,
  success?: middlewareType<ResBody>,
  error?: middlewareType<ResBody>
}

declare function customAdapter (request: Request): Promise<Response>;

declare interface PromisifyOptions {
  onlyWhenOk?: boolean
}

declare interface PreventPromisifyOptions extends PromisifyOptions {
  suspended: true
}



declare type HttpFetchOptions = Omit<RequestOption, 'url'>;

declare class HttpFetchClient<ResBody = any> {
  constructor (options?: { adapter: typeof customAdapter });
  use<UseResBody = ResBody> (callback: middlewareType<UseResBody>|MiddlewareObject<UseResBody>): HttpFetchClient<UseResBody>;
  catch<CatchResBody = ResBody> (callback: middlewareType<CatchResBody>): HttpFetchClient<CatchResBody>
  get<GetResBody = ResBody>  (url: string, options?: HttpFetchOptions): HttpFetchClient<GetResBody>;
  post<PostResBody = ResBody>  (url: string, options?: HttpFetchOptions): HttpFetchClient<PostResBody>;
  put<PutResBody = ResBody>  (url: string, options?: HttpFetchOptions): HttpFetchClient<PutResBody>;
  del<DelResBody = ResBody>  (url: string, options?: HttpFetchOptions): HttpFetchClient<DelResBody>;
  request<RequestResBody = ResBody> (url: string, options?: HttpFetchOptions): HttpFetchClient<RequestResBody>;

  promisify<PromisifyResBody = ResBody>  (options: PreventPromisifyOptions): Promise<[RequestContext<PromisifyResBody>, () => void, () => void]>
  promisify<PromisifyResBody = ResBody>  (options?: PromisifyOptions): Promise<RequestContext<PromisifyResBody>>

  retry (request: Request, handles: HttpFetchClient<ResBody>): HttpFetchClient<ResBody>
}

export default HttpFetchClient