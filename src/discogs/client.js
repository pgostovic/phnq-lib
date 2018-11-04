import fetch from 'cross-fetch';
import md5 from 'md5';
import prettyHrtime from 'pretty-hrtime';
import { newLogger } from '../log';

const log = newLogger('phnq.discogs');

const baseUrl = 'https://api.discogs.com';

let cache = null;
let credentials = null;

export const setCache = theCache => {
  cache = theCache;
};

export const setCredentials = (key, secret) => {
  credentials = { key, secret };
};

export const req = async (path, reqParams, ...attrs) => {
  const { key, secret } = credentials;
  const cacheKey = md5(JSON.stringify({ ...reqParams, path }));

  if (cache) {
    const cached = await cache.get(cacheKey);
    if (cached) {
      log('CACHE %s %o', path, reqParams);
      return cached;
    }
  }

  const params = { ...reqParams, key, secret };

  const q = Object.keys(params)
    .sort()
    .map(k => [k, encodeURIComponent(params[k])].join('='))
    .join('&');

  const url = `${baseUrl}${path}?${q}`;

  const start = process.hrtime();

  const resp = await fetch(url);
  const json = await resp.json();

  log('%s %d %s %o', prettyHrtime(process.hrtime(start)), resp.status, path, reqParams);

  const result = attrs.reduce((obj, attr) => obj[attr], json);
  if (cache) {
    cache.put(cacheKey, result);
  }
  return result;
};
