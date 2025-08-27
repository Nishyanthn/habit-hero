import React, { useState } from 'react';
import '../Styles/NotesModal.css'; // New CSS file for this modal
import { X} from 'lucide-react';

export default function NotesModal({ isOpen, onClose, habit, onSaveNote }) {
  const [newNote, setNewNote] = useState('');

  if (!isOpen || !habit) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return; // Don't save empty notes
    onSaveNote(habit._id, newNote);
    setNewNote('');
  };

  return (
    <div className="notes-modal-overlay" onClick={onClose}>
      <div className="notes-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="notes-modal-header">
          <h2>Notes for "{habit.name}"</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>
        <div className="notes-list">
          {habit.notes && habit.notes.length > 0 ? (
            habit.notes.map((note, index) => (
              <div key={index} className="note-item">
                <p>{note.text}</p>
                <span className="note-date">{new Date(note.date).toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <p className="no-notes-message">No notes yet for this habit.</p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="note-form">
          <textarea
            placeholder="Add a new note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            required
          />
          <button type="submit">Save Note</button>
        </form>
      </div>
    </div>
  );
}
