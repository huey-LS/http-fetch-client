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

declare class Request extends Message {
  getRequestBody (): any;
}

declare class Response extends Message {
  status: number;
  readyStatus: number;
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

declare interface middleware {
  (requestContext: RequestContext): void;
  async (requestContext: RequestContext, next: Function): void;
}

declare interface MiddlewareObject {
  beforeSend?: middleware,
  success?: middleware,
  error?: middleware
}

declare class HttpFetchClient {
  use (callback: middleware|MiddlewareObject): HttpFetchClient;
  catch (callback: middleware): HttpFetchClient
  get (url: string, options?: Object): HttpFetchClient;
  post (url: string, options?: Object): HttpFetchClient;
  put (url: string, options?: Object): HttpFetchClient;
  del (url: string, options?: Object): HttpFetchClient;
  request (url: string, options?: Object): HttpFetchClient;
  promisify (): Promise<RequestContext>
}

export default HttpFetchClient