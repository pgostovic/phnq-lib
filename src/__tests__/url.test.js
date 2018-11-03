import { parseUrl, toUrl } from '../url';

test('simple url', () => {
  const url = parseUrl('http://bubba.com/some-path');
  expect(url.protocol).toBe('http:');
  expect(url.hostname).toBe('bubba.com');
  expect(url.port).toBe('');
  expect(url.pathname).toBe('/some-path');
  expect(url.search).toBe('');
  expect(url.hash).toBe('');
  expect(url.params).toEqual({});
});

test('url with params', () => {
  const url = parseUrl('http://bubba.com/some-path?foo=bar&cheese=cheddar');
  expect(url.params).toEqual({
    foo: 'bar',
    cheese: 'cheddar',
  });
});

test('url with hash', () => {
  const url = parseUrl('http://bubba.com/some-path#my-hash');
  expect(url.hash).toBe('#my-hash');
});

test('file url', () => {
  const url = parseUrl('file:///Users/bubba/Desktop');
  expect(url.protocol).toBe('file:');
  expect(url.hostname).toBe('');
  expect(url.pathname).toBe('/Users/bubba/Desktop');
});

test('relative url', () => {
  const url = parseUrl('/some/path');

  /**
   * Note: the Jest testURL config is set to https://phnq.org:1234/
   * in package.json
   */
  expect(url.protocol).toBe('https:');
  expect(url.hostname).toBe('phnq.org');
  expect(url.port).toBe('1234');
  expect(url.pathname).toBe('/some/path');
});

test('parseUrl, change path, toUrl', () => {
  const url = parseUrl('http://bubba.com/some-path');
  const newUrl = { ...url, pathname: '/other-path' };
  expect(toUrl(newUrl)).toBe('http://bubba.com/other-path');
});

test('parseUrl, change path to /, toUrl', () => {
  const url = parseUrl('http://bubba.com/some-path');
  const newUrl = { ...url, pathname: '/' };
  expect(toUrl(newUrl)).toBe('http://bubba.com/');
});

test('parseUrl, change path, toUrl relative url', () => {
  const url = parseUrl('/some-path');
  const newUrl = { ...url, pathname: '/other-path' };
  expect(toUrl(newUrl)).toBe('https://phnq.org:1234/other-path');
});
