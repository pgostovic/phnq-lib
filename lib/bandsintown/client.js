import fetch from 'cross-fetch';
import md5 from 'md5';
import prettyHrtime from 'pretty-hrtime';
import { newLogger } from '../log';
import hrtime from '../hrtime';

const log = newLogger('phnq.bandsintown');

const baseUrl = 'https://rest.bandsintown.com';

let cache = null;
let appId = null;

export const setCache = theCache => {
  cache = theCache;
};

export const setAppId = theAppId => {
  appId = theAppId;
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

  const params = { ...reqParams, app_id: appId };

  const q = Object.keys(params)
    .sort()
    .map(k => [k, encodeURIComponent(params[k])].join('='))
    .join('&');

  const url = `${baseUrl}${path}?${q}`;

  const start = hrtime();

  const resp = await fetch(url);

  let json;
  try {
    json = await resp.json();
  } catch (err) {
    // Need this because this API returns bad JSON if the artist is not known, even though
    // it does specify a JSON content-type header on the response.
    log('Error parsing JSON: %o', err);
    json = undefined;
  }

  log('%s %d %s %o', prettyHrtime(hrtime(start)), resp.status, path, reqParams);

  const result = attrs.reduce((obj, attr) => obj[attr], json);
  if (cache) {
    cache.put(cacheKey, result);
  }
  return result;
};
