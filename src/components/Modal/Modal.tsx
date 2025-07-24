// src/components/Modal/Modal.tsx
import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

// Інтерфейс для пропсів компонента Modal
interface ModalProps {
  children: React.ReactNode; // Вміст, який буде відображатися всередині модального вікна
  onClose: () => void; // Колбек, який викликається при закритті модального вікна
}

// Шукаємо елемент 'modal-root' у DOM. Якщо його немає, створюємо.
// Це необхідно для createPortal, щоб рендерити модалку поза основним деревом компонентів.
const modalRoot = document.getElementById('modal-root');
if (!modalRoot) {
  const el = document.createElement('div');
  el.setAttribute('id', 'modal-root');
  document.body.appendChild(el);
}

const Modal = ({ children, onClose }: ModalProps) => {
  // Обробник натискання клавіш (для закриття по Escape)
  const handleKeyDown = useCallback((e: KeyboardEvent): void => {
    if (e.code === 'Escape') {
      onClose();
    }
  }, [onClose]); // Залежність onClose

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]); // Залежність handleKeyDown

  // Обробник кліку на бекдроп (фон модального вікна)
  const handleBackdropClick = useCallback((e: React.MouseEvent): void => {
    // Закриваємо модалку тільки якщо клік був саме на бекдропі, а не на його дочірніх елементах
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Використовуємо createPortal для рендерингу модалки в іншому місці DOM (modal-root)
  return createPortal(
    <div className={css.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className={css.modal}>{children}</div>
    </div>,
    document.getElementById('modal-root')! // ! - означає, що ми впевнені, що елемент існує
  );
};

export default Modal;
