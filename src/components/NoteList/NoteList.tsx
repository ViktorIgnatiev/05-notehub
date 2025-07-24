import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';
import css from './NoteList.module.css';
import { Note } from '../../types/note'; 


interface NoteListProps {
  notes: Note[]; 
  onNoteDeleted: () => void; 
}

const NoteList = ({ notes, onNoteDeleted }: NoteListProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation<Note, Error, string>({ 
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onNoteDeleted(); 
      console.log('Нотатка успішно видалена!');
    },
    onError: (mutationError: Error) => {
      console.error('Помилка видалення нотатки:', mutationError);
      alert(`Помилка видалення: ${mutationError.message}`); 
    },
  });

  const handleDelete = useCallback((id: number): void => {
    if (window.confirm('Ви впевнені, що хочете видалити цю нотатку?')) {
      deleteMutation.mutate(String(id));
    }
  }, [deleteMutation]);

  return (
    <ul className={css.list}>
      {notes.map((note: Note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span> 
            <button
              className={css.button}
              onClick={() => handleDelete(note.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
