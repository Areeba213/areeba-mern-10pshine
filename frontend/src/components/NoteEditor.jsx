import React, { useState } from 'react';
import API from '../services/api';

const NoteEditor = ({ note, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (note?.id) {
        const response = await API.put(`/notes/${note.id}`, formData);
        onSave(response.data);
      } else {
        const response = await API.post('/notes', formData);
        onSave(response.data);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <div className="modal">
      <h3>{note ? 'Edit Note' : 'Create New Note'}</h3>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Title" 
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        <textarea 
          placeholder="Content" 
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          required
          rows="4"
        />
        <div className="modal-actions">
          <button type="submit" className="submit-btn">
            {note ? 'Update Note' : 'Save'}
          </button>
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteEditor;