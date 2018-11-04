import md5 from 'md5';
import fetch from 'cross-fetch';
import process from 'process';
import prettyHrtime from 'pretty-hrtime';
import { createNamespace } from 'continuation-local-storage';
import { newLogger } from '../log';

const log = newLogger('phnq.lastfm');

const request = createNamespace('request');

const baseUrl = 'https://ws.audioscrobbler.com/2.0/';

const prune = obj => {
  const o = obj;
  Object.keys(o).forEach(k => {
    if (obj[k] === undefined) {
      delete o[k];
    }
  });
};

export default class Client {
  constructor(apiKey, cache) {
    this.apiKey = apiKey;
    this.cache = cache;
  }

  async req(method, reqParams, ...attrs) {
    if (!this.apiKey) {
      throw new Error('No apiKey set.');
    }

    prune(reqParams);

    const cacheConfig = request.get('cacheConfig') || { disabled: false };
    const shouldCache = !!this.cache && !cacheConfig.disabled;

    const cacheKey = md5(JSON.stringify({ ...reqParams, method }));

    if (shouldCache) {
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        log('CACHE %s %o', method, reqParams);
        return cached;
      }
    }

    const params = {
      method,
      format: 'json',
      api_key: this.apiKey,
      ...reqParams,
    };

    const q = Object.keys(params)
      .sort()
      .map(k => [k, encodeURIComponent(params[k])].join('='))
      .join('&');

    const url = `${baseUrl}?${q}`;

    const start = process.hrtime();

    const resp = await fetch(url);
    const json = await resp.json();

    log('%s %d %s %o', prettyHrtime(process.hrtime(start)), resp.status, method, reqParams);

    if (json.error) {
      throw new Error(`LastFM: ${json.message}`);
    }

    const result = attrs.reduce((obj, attr) => obj[attr], json);
    if (shouldCache) {
      this.cache.put(cacheKey, result);
    }
    return result;
  }
}

export const cache = config => (target, key, descriptor) => {
  const wrapped = descriptor.value;
  return {
    ...descriptor,

    value(...args) {
      return request.runAndReturn(() => {
        request.set('cacheConfig', config);
        return wrapped.call(this, ...args);
      });
    },
  };
};
