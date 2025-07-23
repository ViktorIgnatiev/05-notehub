import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotes, deleteNote } from '../../services/noteService';
import css from './NoteList.module.css';

interface NoteListProps {
  searchTerm: string;
  page: number;
}

const NoteList = ({ searchTerm, page }: NoteListProps) => {
  const queryClient = useQueryClient();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, searchTerm],
    queryFn: () => fetchNotes({ page, perPage: 12, search: searchTerm }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <div className={css.loading}>Loading...</div>;
  if (isError) return <div className={css.error}>Error fetching notes</div>;
  if (!data?.data.length) return <div className={css.empty}>No notes found</div>;

  return (
    <ul className={css.list}>
      {data.data.map((note) => (
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