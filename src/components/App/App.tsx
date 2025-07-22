import React, { useState, useCallback } from 'react';
import css from './App.module.css';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes, CreateNoteParams, createNote } from '../../services/noteService';
import { useDebounce } from 'use-debounce';

function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Затримка 500мс для пошуку
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(
    ['notes', currentPage, debouncedSearchTerm],
    () => fetchNotes({ page: currentPage, search: debouncedSearchTerm }),
    { keepPreviousData: true }
  );

  const handlePageChange = useCallback(({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1); // react-paginate починається з 0
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Скидаємо сторінку при зміні пошукового запиту
  }, []);

  const handleCreateNote = useCallback(async (noteData: CreateNoteParams) => {
    try {
      await createNote(noteData);
      setIsModalOpen(false); // Закриваємо модалку після успішного створення
      refetch(); // Оновлюємо список нотаток
    } catch (err) {
      console.error('Failed to create note:', err);
      // Можна додати обробку помилок для користувача
    }
  }, [refetch]);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  if (isLoading) {
    return (
      <div className={css.app}>
        <p>Завантаження нотаток...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={css.app}>
        <p>Помилка завантаження нотаток: {error?.message || 'Невідома помилка'}</p>
      </div>
    );
  }

  const hasNotes = data && data.notes.length > 0;
  const showPagination = data && data.pagination.totalPages > 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        {showPagination && (
          <Pagination
            pageCount={data.pagination.totalPages}
            currentPage={currentPage - 1}
            onPageChange={handlePageChange}
          />
        )}
        <button onClick={handleOpenModal} className={css.button}>
          Create note +
        </button>
      </header>

      {hasNotes ? (
        <NoteList notes={data.notes} onNoteDeleted={() => refetch()} />
      ) : (
        <p>Немає нотаток. Створіть свою першу нотатку!</p>
      )}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onSubmit={handleCreateNote} onCancel={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}

export default App;