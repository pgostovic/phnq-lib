import { serialize, deserialize } from '../serialize';

test('Encode/decode date member', () => {
  const obj = {
    str: 'Hello',
    num: 42,
    date: new Date(),
  };

  const enc = serialize(obj);
  const dec = deserialize(enc);
  expect(dec.date).toBeInstanceOf(Date);
});
