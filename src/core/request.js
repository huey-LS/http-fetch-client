import Message from './message';
import createContentType, {
  FORMAT_FORM,
  FORMAT_TEXT,
  MEDIA_APPLICATION,
  MEDIA_TEXT
} from '../utils/content-type';

const defaultOptions = {
  timeout: 20000,
  type: 'form',
  accept: 'json',
  async: true
}

const defaultHeaders = {
  'Content-Type': createContentType({
    MIMEType: {
      type: MEDIA_APPLICATION,
      format: FORMAT_FORM
    }
  }),
  'Accept': createContentType({
    MIMEType: {
      media: MEDIA_TEXT,
      format: FORMAT_TEXT
    }
  })
}

export default class Request extends Message {
  constructor (opts) {
    // opts = format(opts)
    opts = {
      ...defaultOptions,
      ...opts
    }
    opts.headers = {
      ...defaultHeaders,
      ...opts.headers
    }
    super(opts);
    this.async = opts.async;
    this.timeout = opts.timeout;
    this.responseType = opts.responseType;
  }

  getBody () {
    if (this.method === 'GET') {
      return '';
    } else {
      return Message.prototype.getBody.call(this);
    }
  }
}
