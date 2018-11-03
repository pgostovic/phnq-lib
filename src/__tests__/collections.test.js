import { isSubset, intersection, uniq } from '../collections';

test('isSubset', () => {
  const s1 = new Set(['one', 'two', 'three']);
  const s2 = new Set(['one', 'two']);
  const s1Again = new Set(['one', 'two', 'three']);
  const s1DiffOrder = new Set(['two', 'one', 'three']);
  expect(isSubset(s1, s2)).toBe(true);
  expect(isSubset(s2, s1)).toBe(false);
  expect(isSubset(s1, s1Again)).toBe(true);
  expect(isSubset(s1, s1DiffOrder)).toBe(true);
});

test('intersection', () => {
  const s1 = new Set(['one', 'two', 'three']);
  const s2 = new Set(['two', 'three', 'four']);

  const s1s2Intersetion = intersection(s1, s2);
  expect(s1s2Intersetion.has('one')).toBe(false);
  expect(s1s2Intersetion.has('two')).toBe(true);
  expect(s1s2Intersetion.has('three')).toBe(true);
  expect(s1s2Intersetion.has('four')).toBe(false);

  const s2s1Intersetion = intersection(s2, s1);
  expect(s2s1Intersetion.has('one')).toBe(false);
  expect(s2s1Intersetion.has('two')).toBe(true);
  expect(s2s1Intersetion.has('three')).toBe(true);
  expect(s2s1Intersetion.has('four')).toBe(false);
});

test('uniq', () => {
  const one = { id: 'uno', value: 1 };
  const oneCopy = { id: 'uno', value: 1 };
  const two = { id: 'dos', value: 2 };
  const three = { id: 'tres', value: 3 };

  const arr = [one, oneCopy, two, three];

  const arrUniqNoKey = uniq(arr);
  expect(arrUniqNoKey.length).toBe(4);

  const arrUniq = uniq(arr, item => item.id);
  expect(arrUniq.length).toBe(3);
});
