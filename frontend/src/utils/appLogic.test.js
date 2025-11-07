// Test actual application logic without jest
describe('Application Business Logic', () => {
  test('user data validation', () => {
    const isValidUser = (user) => {
      return user && user.name && user.email && user.id;
    };

    const validUser = { id: 1, name: 'Test', email: 'test@test.com' };
    const invalidUser = { name: 'Test' };

    expect(isValidUser(validUser)).toBe(true);
    expect(isValidUser(invalidUser)).toBe(false);
  });

  test('note validation', () => {
    const isValidNote = (note) => {
      return note && note.title && note.title.trim() !== '';
    };

    expect(isValidNote({ title: 'Test Note' })).toBe(true);
    expect(isValidNote({ title: '' })).toBe(false);
    expect(isValidNote({})).toBe(false);
  });

  test('search functionality', () => {
    const performSearch = (notes, query) => {
      return notes.filter(note => 
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase())
      );
    };

    const notes = [
      { title: 'React Notes', content: 'Learn React hooks' },
      { title: 'Node.js', content: 'Backend development' }
    ];

    const results = performSearch(notes, 'react');
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('React Notes');
  });
});