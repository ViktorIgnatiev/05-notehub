import React, { useCallback } from 'react';
import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css'; // Імпорт CSS-модуля

interface PaginationProps {
  pageCount: number;
  currentPage: number; // 0-based index
  onPageChange: (selectedItem: { selected: number }) => void;
}

function Pagination({ pageCount, currentPage, onPageChange }: PaginationProps) {
  // useCallback для оптимізації, хоча ReactPaginate сам оптимізований
  const handlePageClick = useCallback((event: { selected: number }) => {
    onPageChange(event);
  }, [onPageChange]);

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      onPageChange={handlePageClick}
      pageRangeDisplayed={3} // Кількість сторінок, які відображаються навколо поточної
      marginPagesDisplayed={1} // Кількість сторінок, які відображаються на початку та в кінці
      pageCount={pageCount}
      previousLabel="<"
      renderOnZeroPageCount={null}
      forcePage={currentPage} // Примусово встановлює поточну сторінку
      className={css.pagination} // Застосування стилів до контейнера пагінації
      pageLinkClassName={css.pageLink}
      activeLinkClassName={css.activePageLink}
      previousLinkClassName={css.prevLink}
      nextLinkClassName={css.nextLink}
      disabledLinkClassName={css.disabledLink}
      breakLinkClassName={css.breakLink}
    />
  );
}

export default Pagination;