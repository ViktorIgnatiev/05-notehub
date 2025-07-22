import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css'; // Імпорт CSS-модуля

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const modalRoot = document.getElementById('modal-root'); // Потрібно додати div#modal-root до index.html

if (!modalRoot) {
  const el = document.createElement('div');
  el.setAttribute('id', 'modal-root');
  document.body.appendChild(el);
}

function Modal({ children, onClose }: ModalProps) {
  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div className={css.modal}>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')!
  );
}

export default Modal;