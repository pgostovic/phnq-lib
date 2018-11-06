import md5 from 'md5';
import fetch from 'cross-fetch';
import prettyHrtime from 'pretty-hrtime';
import { newLogger } from '../log';
import { hrtime } from '../hrtime';

const log = newLogger('phnq.wikipedia');

let cache = null;

export const setCache = theCache => {
  cache = theCache;
};

const baseUrl = 'https://en.wikipedia.org/w/api.php';

export const searchReq = (text, ...attrs) =>
  req(
    {
      action: 'query',
      list: 'search',
      srsearch: text,
    },
    ...attrs
  );

export const pageExtractsReq = (pageId, reqParams, ...attrs) =>
  req(
    {
      action: 'query',
      prop: 'extracts',
      pageids: pageId,
      ...reqParams,
    },
    ...attrs
  );

const req = async (reqParams, ...attrs) => {
  const cacheKey = md5(JSON.stringify(reqParams));

  if (cache) {
    const cached = await cache.get(cacheKey);
    if (cached) {
      log('CACHE %o', reqParams);
      return cached;
    }
  }

  const params = { ...reqParams, format: 'json', utf8: 1 };

  const q = Object.keys(params)
    .sort()
    .map(k => [k, encodeURIComponent(params[k])].join('='))
    .join('&');

  const url = `${baseUrl}?${q}`;

  const start = hrtime();

  const resp = await fetch(url);
  const json = await resp.json();

  log('URL', url);
  log('%s %d %o', prettyHrtime(hrtime(start)), resp.status, reqParams);

  if (json.error) {
    throw new Error(`LastFM: ${json.message}`);
  }

  const result = attrs.reduce((obj, attr) => obj[attr], json);
  if (cache) {
    cache.put(cacheKey, result);
  }
  return result;
};

// https://www.mediawiki.org/wiki/Extension:TextExtracts#Caveats

// https://en.wikipedia.org/w/api.php?action=query&prop=info|extracts&pageids=6846409&exintro=true&explaintext=true
