import React, { useCallback } from 'react';
import css from './SearchBox.module.css'; // Імпорт CSS-модуля

interface SearchBoxProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function SearchBox({ searchTerm, onSearchChange }: SearchBoxProps) {
  // Використовуємо useCallback для оптимізації, щоб функція не створювалася на кожному рендері
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event);
  }, [onSearchChange]);

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={searchTerm}
      onChange={handleChange}
    />
  );
}

export default SearchBox;