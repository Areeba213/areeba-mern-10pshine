import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import CreateNote from '../components/CreateNote';
import EditNote from '../components/EditNote';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await API.get('/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNoteCreated = (newNote) => {
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await API.delete(`/notes/${noteId}`);
        setNotes(notes.filter(note => note.id !== noteId));
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const handleUpdateNote = (updatedNote) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
    setEditingNote(null);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Your Notes</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      
      <div className="notes-section">
        <div className="notes-header">
          <h2>My Collection</h2>
          <CreateNote onNoteCreated={handleNoteCreated} />
        </div>
        
        {notes.length === 0 ? (
          <div className="empty-state">
            <h3>No Notes Yet</h3>
            <p>Create your first note to get started</p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map(note => (
              <div key={note.id} className="note-card">
                <div className="note-content">
                  <h3 className="note-title">{note.title}</h3>
                  <p className="note-body">{note.content}</p>
                </div>
                <div className="note-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => setEditingNote(note)}
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

      {/* Edit Note Modal */}
      {editingNote && (
        <EditNote 
          note={editingNote}
          onNoteUpdated={handleUpdateNote}
          onCancel={() => setEditingNote(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;