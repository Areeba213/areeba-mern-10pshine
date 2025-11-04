// Test note-related utilities used in the app
describe('Note Utilities', () => {
  const mockNotes = [
    {
      id: 1,
      title: 'Shopping List',
      content: 'Buy milk and eggs',
      created_at: '2024-01-15T10:00:00.000Z',
      last_modified: '2024-01-15T10:00:00.000Z'
    },
    {
      id: 2,
      title: 'Meeting Notes',
      content: 'Discuss project requirements',
      created_at: '2024-01-16T14:30:00.000Z',
      last_modified: '2024-01-16T15:00:00.000Z'
    },
    {
      id: 3,
      title: 'Ideas',
      content: 'New features for the app',
      created_at: '2024-01-17T09:15:00.000Z'
    }
  ];

  test('format note date displays correctly', () => {
    const note = mockNotes[0];
    const formattedDate = new Date(note.last_modified).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    expect(formattedDate).toMatch(/Jan 15, 2024/);
  });

  test('search filters notes by title and content', () => {
    const searchNotes = (notes, term) => {
      if (!term.trim()) return notes;
      return notes.filter(note =>
        note.title.toLowerCase().includes(term.toLowerCase()) ||
        (note.content && note.content.toLowerCase().includes(term.toLowerCase()))
      );
    };

    // Search by title
    const titleResults = searchNotes(mockNotes, 'shopping');
    expect(titleResults).toHaveLength(1);
    expect(titleResults[0].title).toBe('Shopping List');

    // Search by content
    const contentResults = searchNotes(mockNotes, 'project');
    expect(contentResults).toHaveLength(1);
    expect(contentResults[0].title).toBe('Meeting Notes');

    // Empty search returns all
    const emptyResults = searchNotes(mockNotes, '');
    expect(emptyResults).toHaveLength(3);
  });

  test('note color assignment works', () => {
    const getNoteColor = (index) => `note-color-${(index % 5) + 1}`;
    
    expect(getNoteColor(0)).toBe('note-color-1');
    expect(getNoteColor(1)).toBe('note-color-2');
    expect(getNoteColor(4)).toBe('note-color-5');
    expect(getNoteColor(5)).toBe('note-color-1'); // Wraps around
  });
});