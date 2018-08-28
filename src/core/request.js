import Message from './message';
import createContentType, {
  FORMAT_TYPES,
  MEDIA_TYPES
} from '../utils/content-type';

const {
  FORMAT_FORM,
  FORMAT_TEXT,
  FORMAT_JSON,
} = FORMAT_TYPES;

const {
  MEDIA_APPLICATION,
  MEDIA_TEXT
} = MEDIA_TYPES;

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
    this.bodyFormatType = opts.bodyFormatType;
  }

  getRequestBody () {
    if (this.method === 'GET') {
      return '';
    } else if (this.bodyFormatType) {
      return this.body.write(this.bodyFormatType);
    } else {
      let formatType = this.header.getContentFormatType();
      return this.body.write(formatType)
    }
  }
}
