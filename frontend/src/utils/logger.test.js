// Test the actual logger used in the app
import logger from './logger';

describe('Application Logger', () => {
  test('logger has all required methods', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  test('logger methods can be called without errors', () => {
    expect(() => logger.info('Test message')).not.toThrow();
    expect(() => logger.error('Error message')).not.toThrow();
    expect(() => logger.warn('Warning message')).not.toThrow();
  });
});