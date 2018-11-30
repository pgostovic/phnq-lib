import { encode, decode } from '../serialize';

test('Encode/decode date member', () => {
  const obj = {
    str: 'Hello',
    num: 42,
    date: new Date(),
  };

  const enc = encode(obj);
  const dec = decode(enc);
  expect(dec.date).toBeInstanceOf(Date);
});
