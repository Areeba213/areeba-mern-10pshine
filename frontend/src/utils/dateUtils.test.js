// Test date utilities used in the app
describe('Date Utilities', () => {
  test('format display date for notes', () => {
    const formatDisplayDate = (dateString) => {
      if (!dateString) return 'No date';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    expect(formatDisplayDate('2024-01-15')).toMatch(/Jan 15, 2024/);
    expect(formatDisplayDate(null)).toBe('No date');
  });

  test('sort notes by date', () => {
    const sortNotesByDate = (notes) => {
      return notes.sort((a, b) => {
        const dateA = new Date(a.last_modified || a.created_at);
        const dateB = new Date(b.last_modified || b.created_at);
        return dateB - dateA; // newest first
      });
    };

    const notes = [
      { title: 'Old', created_at: '2024-01-01' },
      { title: 'New', created_at: '2024-01-15' }
    ];

    const sorted = sortNotesByDate(notes);
    expect(sorted[0].title).toBe('New');
    expect(sorted[1].title).toBe('Old');
  });
});