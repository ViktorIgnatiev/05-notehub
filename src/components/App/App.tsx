import { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useDebounce } from 'use-debounce';
import css from './App.module.css';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import { fetchNotes, type FetchNotesResponse } from '../../services/noteService';

const queryClient = new QueryClient();

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [debouncedSearchTerm] = useDebounce<string>(searchTerm, 500);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', page, debouncedSearchTerm],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearchTerm }),
    keepPreviousData: true,
  });

  const handleCreateNote = useCallback((): void => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback((): void => {
    setIsModalOpen(false);
    refetch();
  }, [refetch]);

  const handleSearchChange = useCallback((value: string): void => {
    setSearchTerm(value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((selectedPage: number): void => {
    setPage(selectedPage);
  }, []);

  if (isLoading) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className={css.app}>
          <p>Завантаження нотаток...</p>
        </div>
      </QueryClientProvider>
    );
  }

  if (isError) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className={css.app}>
          <p>Помилка завантаження нотаток: {error?.message || 'Невідома помилка'}</p>
        </div>
      </QueryClientProvider>
    );
  }

  const hasNotes: boolean = data?.data && data.data.length > 0;
  const totalPages: number = data?.totalPages || 1;

  return (
    <QueryClientProvider client={queryClient}>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={searchTerm} onChange={handleSearchChange} />
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
          <button className={css.button} onClick={handleCreateNote}>
            Create note +
          </button>
        </header>

        <main className={css.main}>
          {hasNotes ? (
            <NoteList notes={data.data || []} onNoteDeleted={refetch} />
          ) : (
            <p>Немає нотаток. Створіть свою першу нотатку!</p>
          )}
        </main>

        {isModalOpen && (
          <Modal onClose={handleCloseModal}>
            <NoteForm onSuccess={handleCloseModal} />
          </Modal>
        )}
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
