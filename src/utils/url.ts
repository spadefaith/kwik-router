export const parseUrl = (path) => {
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
};

export const addParamsToURL = (path, params) => {
  let searchParams = new URLSearchParams();
  for (let key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      searchParams.append(key, encodeURIComponent(params[key]));
    }
  }

  return `${path}?${searchParams.toString()}`;
};
