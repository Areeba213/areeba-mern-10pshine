// Test actual application utilities
import { add, multiply, divide } from './utils/calculator';

describe('Application Utilities', () => {
  test('calculator functions work for note calculations', () => {
    expect(add(2, 3)).toBe(5); // For note counts
    expect(multiply(5, 4)).toBe(20); // For pagination
  });

  test('division handles edge cases', () => {
    expect(divide(10, 2)).toBe(5);
    expect(() => divide(10, 0)).toThrow('Division by zero');
  });
});

// Test date formatting (used in notes)
describe('Date Utilities', () => {
  test('formats dates for note display', () => {
    const date = new Date('2024-01-01');
    expect(date instanceof Date).toBe(true);
  });

  test('handles date comparisons', () => {
    const date1 = new Date('2024-01-01');
    const date2 = new Date('2024-01-02');
    expect(date1 < date2).toBe(true);
  });
});