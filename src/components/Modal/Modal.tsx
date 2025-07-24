import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const modalRoot = document.getElementById('modal-root');
if (!modalRoot) {
  const el = document.createElement('div');
  el.setAttribute('id', 'modal-root');
  document.body.appendChild(el);
}

const Modal = ({ children, onClose }: ModalProps) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent): void => {
    if (e.code === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleBackdropClick = useCallback((e: React.MouseEvent): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return createPortal(
    <div className={css.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className={css.modal}>{children}</div>
    </div>,
    document.getElementById('modal-root')!
  );
};

export default Modal;
