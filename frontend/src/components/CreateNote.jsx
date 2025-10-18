import React, { useState } from 'react';
import NoteEditor from './NoteEditor';

const CreateNote = ({ onNoteCreated }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (newNote) => {
    onNoteCreated(newNote);
    setIsOpen(false);
  };

  return (
    <div className="create-note">
      <button 
        onClick={() => setIsOpen(true)} 
        className="create-btn"
      >
        + Create New Note
      </button>
      
      {isOpen && (
        <div className="modal-overlay">
          <div className="editor-modal">
            <NoteEditor 
              onSave={handleSave}
              onCancel={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNote;