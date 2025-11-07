// Simple test that works with ES modules
test('basic frontend test - addition', () => {
  expect(1 + 1).toBe(2);
});

test('basic frontend test - string', () => {
  expect('hello'.toUpperCase()).toBe('HELLO');
});

test('basic frontend test - array', () => {
  expect([1, 2, 3]).toHaveLength(3);
});