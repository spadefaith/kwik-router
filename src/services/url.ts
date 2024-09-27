type ParseUrlType = {
  origin: string;
  pathname: string;
  search: object;
  searchParams: string;
};

export default class UrlService {
  str: string;
  url: ParseUrlType;
  constructor(str) {
    this.str = str;
    this.url = UrlService.parseUrl(str);
  }

  static parseUrl(path): ParseUrlType {
    let urlClass = null;

    try {
      urlClass = new URL(path);
    } catch (err) {
      let url = `http://localhost${path}`;
      urlClass = new URL(url);
    }

    let o: any = { search: {} };
    if (urlClass) {
      o.pathname = urlClass.pathname;
      o.origin = urlClass.origin;

      if (urlClass.search) {
        let params = new URLSearchParams(urlClass.search);
        for (let [key, value] of params.entries()) {
          o.search[key] = value;
        }
        o.searchParams = params.toString();
      }
    }

    return o;
  }

  upsertParams(params) {
    const { search, pathname, origin } = this.url;

    const p = {
      ...search,
      ...params,
    };
    let searchParams = new URLSearchParams();
    for (let key in p) {
      if (Object.prototype.hasOwnProperty.call(p, key)) {
        searchParams.append(key, encodeURIComponent(p[key]));
      }
    }

    UrlService.parseUrl(`${origin}${pathname}?${searchParams.toString()}`);

    return this.href;
  }

  get href() {
    const { search, pathname, origin, searchParams } = this.url;
    return `${origin}${pathname}?${searchParams}`;
  }
}
