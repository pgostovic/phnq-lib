import md5 from 'md5';
import fetch from 'cross-fetch';
import prettyHrtime from 'pretty-hrtime';
import uuid from 'uuid/v4';
import { createNamespace } from 'continuation-local-storage';
import SpotifyError from './error';
import { newLogger } from '../log';

const log = newLogger('phnq.spotify');

const request = createNamespace('request');

const clientAccess = { token: null, expiry: 0 };

const BASE_URL = 'https://api.spotify.com/v1';

export class Client {
  constructor(clientId, clientSecret, clientRedirectUri, cache) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.clientRedirectUri = clientRedirectUri;
    this.cache = cache;
    this.userSalt = uuid();
    this.accessToken = null;
    this.expiry = 0;
    this.refreshToken = null;
    this.onRefreshed = null;
  }

  isConnected() {
    return !!this.accessToken;
  }

  async setCode(code) {
    log('set code %s', code);

    const tokenInfo = await getTokenInfo(
      {
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.clientRedirectUri,
      },
      this.clientId,
      this.clientSecret
    );

    this.accessToken = tokenInfo.access_token;
    this.expiry = Date.now() + tokenInfo.expires_in * 1000;
    this.refreshToken = tokenInfo.refresh_token;

    if (this.onRefreshed) {
      await this.onRefreshed();
    }
  }

  async getAccessToken() {
    if (this.refreshToken && Date.now() > this.expiry) {
      log('refresh access token %dms past expiry', Date.now() - this.expiry);
      const tokenInfo = await getTokenInfo(
        {
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
        },
        this.clientId,
        this.clientSecret
      );

      this.accessToken = tokenInfo.access_token;
      this.expiry = Date.now() + tokenInfo.expires_in * 1000;

      if (this.onRefreshed) {
        await this.onRefreshed();
      }
    }
    return this.accessToken;
  }

  onTokenRefreshed(onRefreshed) {
    this.onRefreshed = onRefreshed;
  }

  get(path, params = {}, ...attrs) {
    return this.req('GET', path, params, ...attrs);
  }

  del(path, params = {}, ...attrs) {
    return this.req('DELETE', path, params, ...attrs);
  }

  post(path, params = {}, ...attrs) {
    return this.req('POST', path, params, ...attrs);
  }

  put(path, params = {}, ...attrs) {
    return this.req('PUT', path, params, ...attrs);
  }

  async req(method, path, params = {}, ...attrs) {
    const cacheConfig = request.get('cacheConfig') || { disabled: false };
    const shouldCache = method === 'GET' && !!this.cache && !cacheConfig.disabled;
    const needsAuth = request.get('needsAuth');
    const urlComps = [BASE_URL, path];
    let accessToken;

    const cacheKeyAttrs = [method, path, params];
    if (needsAuth) {
      cacheKeyAttrs.push(this.userSalt);
    }
    const cacheKey = md5(JSON.stringify(cacheKeyAttrs));
    if (shouldCache) {
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        log('CACHE %s %s %o', method, path, params);
        return cached;
      }
    }

    if (needsAuth) {
      accessToken = await this.getAccessToken();
    } else {
      accessToken = await getAnonymousAccessToken(this.clientId, this.clientSecret);
    }

    const fetchOptions = {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    switch (method) {
      case 'GET':
      case 'DELETE': {
        const q = Object.keys(params)
          .map(k => [k, encodeURIComponent(params[k])].join('='))
          .join('&');

        if (q) {
          urlComps.push('?');
          urlComps.push(q);
        }
        break;
      }

      case 'PUT':
      case 'POST': {
        fetchOptions.body = JSON.stringify(params);
        fetchOptions.headers['content-type'] = 'application/json';
        break;
      }

      default:
    }

    const url = urlComps.join('');

    const start = process.hrtime();

    const resp = await fetch(url, fetchOptions);

    log('%s %d %s %s %o', prettyHrtime(process.hrtime(start)), resp.status, method, path, params);

    const json = resp.status === 204 ? null : await resp.json();

    if (json && json.error) {
      const { status, message } = json.error;
      throw new SpotifyError(status, message);
    }

    const result = json === null ? null : attrs.reduce((obj, attr) => obj[attr], json);
    if (shouldCache) {
      this.cache.put(cacheKey, result);
    }
    return result;
  }
}

export const getAnonymousAccessToken = async (clientId, clientSecret) => {
  if (Date.now() > clientAccess.expiry) {
    const tokenInfo = await getTokenInfo({ grant_type: 'client_credentials' }, clientId, clientSecret);
    clientAccess.token = tokenInfo.access_token;
    clientAccess.expiry = Date.now() + tokenInfo.expires_in * 1000;
  }
  return clientAccess.token;
};

const getTokenInfo = async (params, clientId, clientSecret) => {
  if (!clientSecret) {
    throw new Error('No client secret set.');
  }

  const fetchOptions = {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: Object.keys(params)
      .reduce((nvps, key) => [...nvps, `${key}=${encodeURIComponent(params[key])}`], [])
      .join('&'),
  };

  return (await fetch('https://accounts.spotify.com/api/token', fetchOptions)).json();
};

export const auth = (target, key, descriptor) => {
  const wrapped = descriptor.value;
  return {
    ...descriptor,

    value(...args) {
      return request.runAndReturn(() => {
        request.set('needsAuth', true);
        return wrapped.call(this, ...args);
      });
    },
  };
};

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
