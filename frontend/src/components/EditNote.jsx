import React from 'react';
import NoteEditor from './NoteEditor';

const EditNote = ({ note, onNoteUpdated, onCancel }) => {
  const handleSave = (updatedNote) => {
    onNoteUpdated(updatedNote);
  };

  return (
    <div className="modal-overlay">
      <div className="editor-modal">
        <NoteEditor 
          note={note}
          onSave={handleSave}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};

export default EditNote;