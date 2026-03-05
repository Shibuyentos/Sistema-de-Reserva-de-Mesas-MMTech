// frontend/src/context/ModalContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import AppModal from '../components/AppModal';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);

  const showModal = useCallback((options) => {
    setModal(options);
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  const handleConfirm = () => {
    if (modal?.onConfirm) modal.onConfirm();
    closeModal();
  };

  const handleCancel = () => {
    if (modal?.onCancel) modal.onCancel();
    closeModal();
  };

  return (
    <ModalContext.Provider value={{ showModal }}>
      {children}
      {modal && (
        <AppModal
          type={modal.type || 'info'}
          message={modal.message}
          confirmText={modal.confirmText}
          cancelText={modal.cancelText}
          onConfirm={handleConfirm}
          onCancel={modal.type === 'confirm' ? handleCancel : null}
        />
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within a ModalProvider');
  return context;
}
