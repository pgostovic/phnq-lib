import fetch from 'cross-fetch';
import md5 from 'md5';
import prettyHrtime from 'pretty-hrtime';
import { newLogger } from '../log';
import hrtime from '../hrtime';

const log = newLogger('phnq.songkick');

const baseUrl = 'https://api.songkick.com/api/3.0';

let cache = null;
let apikey = null;

export const setCache = theCache => {
  cache = theCache;
};

export const setApiKey = theApiKey => {
  apikey = theApiKey;
};

export const req = async (path, reqParams, ...attrs) => {
  const cacheKey = md5(JSON.stringify({ ...reqParams, path }));

  if (cache) {
    const cached = await cache.get(cacheKey);
    if (cached) {
      log('CACHE %s %o', path, reqParams);
      return cached;
    }
  }

  const params = { ...reqParams, apikey };

  const q = Object.keys(params)
    .sort()
    .map(k => [k, encodeURIComponent(params[k])].join('='))
    .join('&');

  const url = `${baseUrl}${path}?${q}`;

  const start = hrtime();

  const resp = await fetch(url);
  const json = await resp.json();

  log('%s %d %s %o', prettyHrtime(hrtime(start)), resp.status, path, reqParams);

  if (json.error) {
    throw new Error(`LastFM: ${json.message}`);
  }

  const result = attrs.reduce((obj, attr) => obj[attr], json);
  if (cache) {
    cache.put(cacheKey, result);
  }
  return result;
};
