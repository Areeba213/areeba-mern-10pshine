import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, onUpdateUser, onLogout }) => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('token');

  // Load notes from backend
  const fetchNotes = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:3000/notes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const notesData = await response.json();
        const notesWithColors = notesData.map((note, index) => ({
  ...note,
  color: `note-color-${(index % 5) + 1}`,
  // Use last_modified if available, else use created_at
  date: note.last_modified ? new Date(note.last_modified).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }) : note.created_at ? new Date(note.created_at).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }) : 'No date'
}));
        
        setNotes(notesWithColors);
        setFilteredNotes(notesWithColors);
      } else {
        setNotes([]);
        setFilteredNotes([]);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes([]);
      setFilteredNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredNotes(filtered);
    }
  }, [searchTerm, notes]);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
    setShowDropdown(false);
  };

  const handleSettings = () => {
    navigate('/settings');
    setShowDropdown(false);
  };
  

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setNewNoteTitle('');
    setNewNoteContent('');
    setShowModal(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content);
    setShowModal(true);
  };

  const handleDeleteNote = async (id) => {
    const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
    
    if (settings.confirmBeforeDeleting !== false) {
      if (!window.confirm('Are you sure you want to delete this note?')) return;
    }

    try {
      const token = getToken();
      const response = await fetch(`http://localhost:3000/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchNotes();
      } else {
        alert('Failed to delete note');
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    }
  };

  const handleSaveNote = async () => {
    if (newNoteTitle.trim() === '') return;

    try {
      const token = getToken();
      
      if (editingNote) {
        // Update note
        const response = await fetch(`http://localhost:3000/notes/${editingNote.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: newNoteTitle,
            content: newNoteContent
          }),
        });

        if (response.ok) {
          await fetchNotes();
        } else {
          alert('Failed to update note');
          return;
        }
      } else {
        // Create new note
        const response = await fetch('http://localhost:3000/notes', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: newNoteTitle,
            content: newNoteContent
          }),
        });

        if (response.ok) {
          await fetchNotes();
        } else {
          alert('Failed to create note');
          return;
        }
      }

      setShowModal(false);
      setNewNoteTitle('');
      setNewNoteContent('');
    } catch (error) {
      alert('Network error: ' + error.message);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  if (!user) {
    return (
      <div className="dashboard">
        <div className="empty-state">
          <h3>Please log in to view your notes</h3>
          <button className="create-btn" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>ThinkSync</h1>
        <div className="header-controls">
          <div className="user-menu">
            <button className="user-btn" onClick={toggleDropdown}>
              <span className="user-avatar">
                {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'US'}
              </span>
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <p className="user-name">{user.name}</p>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={handleProfile}>
                  My Profile
                </button>
                <button className="dropdown-item" onClick={handleSettings}>
                  Settings
                </button>
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="notes-section">
        <div className="notes-header">
          <h2>Notes</h2>
          <button className="create-btn" onClick={handleCreateNote}>
            + Create Note
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="empty-state">
            <h3>Loading notes...</h3>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <h3>{searchTerm ? 'No notes found' : 'No notes yet'}</h3>
            <p>{searchTerm ? 'Try a different search term' : 'Create your first note to get started'}</p>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map(note => (
              <div key={note.id} className={`note-card ${note.color}`}>
                <div className="note-header">
                  <h3 className="note-title">{note.title}</h3>
                  {note.date && <span className="note-date">{note.date}</span>}
                </div>
                {note.content && <p className="note-body">{note.content}</p>}
                <div className="note-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditNote(note)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingNote ? 'Edit Note' : 'Create New Note'}</h3>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Note Title"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <textarea
                className="form-input textarea"
                placeholder="Note Content"
                rows="4"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button className="submit-btn" onClick={handleSaveNote}>
                {editingNote ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;