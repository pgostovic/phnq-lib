import { ColorRGB } from '../color';

test('hex', () => {
  const black = new ColorRGB('#000000');
  expect(black.toString()).toBe('#000000');
});

test('hex lowercase', () => {
  const black = new ColorRGB('#abcdef');
  expect(black.toString()).toBe('#abcdef');
});

test('hex uppercase', () => {
  const black = new ColorRGB('#ABCDEF');
  expect(black.toString()).toBe('#abcdef');
});

test('hex short', () => {
  const black = new ColorRGB('#ccc');
  expect(black.toString()).toBe('#cccccc');
});

test('rgb', () => {
  const black = new ColorRGB(0, 0, 0);
  expect(black.toString()).toBe('#000000');
});

test('rgba', () => {
  const black = new ColorRGB(0, 0, 0, 0.5);
  expect(black.toString()).toBe('rgba(0, 0, 0, 0.5)');
});

test('rgba opaque', () => {
  const black = new ColorRGB(0, 0, 0, 1);
  expect(black.toString()).toBe('#000000');
});

test('hex alpha', () => {
  const blackAlpha = new ColorRGB('#000000').alpha(0.5);
  expect(blackAlpha.toString()).toBe('rgba(0, 0, 0, 0.5)');
});

test('rgb alpha', () => {
  const blackAlpha = new ColorRGB(0, 0, 0).alpha(0.5);
  expect(blackAlpha.toString()).toBe('rgba(0, 0, 0, 0.5)');
});

test('embed in string template', () => {
  const black = new ColorRGB(0, 0, 0);
  expect(`color: ${black};`).toBe('color: #000000;');
});

/* eslint-disable no-new */
test('invalid arguments hex', () => {
  expect(() => {
    new ColorRGB('ashdkjashdjk'); // random stuff
  }).toThrow();

  expect(() => {
    new ColorRGB('#00000g'); // non-hex character
  }).toThrow();

  expect(() => {
    new ColorRGB('#0000000'); // 7 hex chars
  }).toThrow();

  expect(() => {
    new ColorRGB('#00000'); // 5 hex chars
  }).toThrow();

  expect(() => {
    new ColorRGB('#0000'); // 4 hex chars
  }).toThrow();

  expect(() => {
    new ColorRGB('#00'); // 2 hex chars
  }).toThrow();
});

test('invalid arguments rgb', () => {
  expect(() => {
    new ColorRGB(0, 0, -1); // negative
  }).toThrow();

  expect(() => {
    new ColorRGB(0, 0, 256); // big
  }).toThrow();

  expect(() => {
    new ColorRGB(0, 0, 0, 2); // big alpha
  }).toThrow();

  expect(() => {
    new ColorRGB(0, 0, 0, 0, 0); // too many args
  }).toThrow();
});
