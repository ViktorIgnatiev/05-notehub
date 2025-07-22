import React, { useCallback } from 'react';
import css from './NoteList.module.css'; // Імпорт CSS-модуля
import { Note } from '../../types/note';
import { useMutation } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';

interface NoteListProps {
  notes: Note[];
  onNoteDeleted: () => void;
}

function NoteList({ notes, onNoteDeleted }: NoteListProps) {
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      onNoteDeleted(); // Сповіщаємо батьківський компонент про видалення для оновлення даних
      alert('Нотатка успішно видалена!'); // Просте повідомлення
    },
    onError: (error) => {
      console.error('Помилка видалення нотатки:', error);
      alert(`Помилка видалення нотатки: ${error.message}`);
    },
  });

  const handleDelete = useCallback((id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю нотатку?')) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note._id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            {note.tags && note.tags.length > 0 && (
              <span className={css.tag}>{note.tags[0]}</span> // Припускаємо, що тег завжди один
            )}
            <button onClick={() => handleDelete(note._id)} className={css.button}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;