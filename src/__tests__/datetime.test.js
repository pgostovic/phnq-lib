import { formatDuration } from '../datetime';

test('1:23:45', () => {
  expect(formatDuration(5025000)).toBe('1:23:45');
});

test('1:01:35', () => {
  expect(formatDuration(3695000)).toBe('1:01:35');
});

test('1:35', () => {
  expect(formatDuration(95000)).toBe('1:35');
});

test('0:00', () => {
  expect(formatDuration(0)).toBe('0:00');
});

test('0:05', () => {
  expect(formatDuration(5000)).toBe('0:05');
});

test('0:45', () => {
  expect(formatDuration(45000)).toBe('0:45');
});
