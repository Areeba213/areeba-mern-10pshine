// Test form validation used in the app
describe('Form Validation', () => {
  test('email validation', () => {
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  test('password validation', () => {
    const isValidPassword = (password) => {
      return password && password.length >= 6;
    };

    expect(isValidPassword('password123')).toBe(true);
    expect(isValidPassword('12345')).toBe(false);
    expect(isValidPassword('')).toBe(false);
  });

  test('note title validation', () => {
    const isValidNoteTitle = (title) => {
      return title && title.trim().length > 0 && title.trim().length <= 100;
    };

    expect(isValidNoteTitle('Valid Title')).toBe(true);
    expect(isValidNoteTitle('')).toBe(false);
    expect(isValidNoteTitle('   ')).toBe(false);
  });
});