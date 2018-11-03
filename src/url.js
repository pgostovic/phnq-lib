const URL_RE = /((http:|https:|file:)\/\/(([^:/]*)(:(\d+))?))?([^?#]*)(\?[^#]*)?(#.*)?/;

export const parseUrl = url => {
  const m = URL_RE.exec(url);
  if (m) {
    const loc = window.location;
    const protoPortHost = m[1];
    const protocol = protoPortHost === undefined ? loc.protocol : m[2];
    const host = protoPortHost === undefined ? loc.host : m[3];
    const hostname = protoPortHost === undefined ? loc.hostname : m[4];
    const port = protoPortHost === undefined ? loc.port : m[6] || '';
    const pathname = m[7];
    const search = m[8] || '';
    const hash = m[9] || '';

    const params = {};
    search
      .split(/[&?]/)
      .filter(x => !!x)
      .forEach(nvp => {
        const [n, v] = nvp.split('=');
        params[n] = decodeURIComponent(v);
      });

    return {
      protocol,
      host,
      hostname,
      port,
      pathname,
      search,
      hash,
      params,
    };
  }
  return null;
};

export const toUrl = ({ protocol, hostname, port, pathname, hash, params = {} }) => {
  const buf = [];
  buf.push(`${protocol}//${hostname}`);
  if (port && ((protocol === 'http:' && port !== '80') || (protocol === 'https:' && port !== '443'))) {
    buf.push(`:${port}`);
  }
  buf.push(pathname);
  buf.push(Object.keys(params).reduce((s, k) => `${s}${s === '' ? '?' : '&'}${k}=${params[k]}`, ''));
  buf.push(hash);
  return buf.join('');
};
