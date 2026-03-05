// frontend/src/components/AppModal.jsx
import React from 'react';
import './AppModal.css';

const ICONS = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11.5 14.5 15.5 9.5" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <circle cx="12" cy="16" r="0.5" fill="currentColor" />
    </svg>
  ),
  confirm: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" />
    </svg>
  ),
};

const TITLES = {
  success: 'Sucesso',
  error: 'Erro',
  info: 'Informação',
  confirm: 'Confirmar',
};

function AppModal({ type = 'info', message, confirmText, cancelText, onConfirm, onCancel }) {
  const title = TITLES[type];
  const icon = ICONS[type];
  const isConfirm = type === 'confirm';

  return (
    <div className="app-modal-overlay" onClick={isConfirm ? undefined : onConfirm}>
      <div className="app-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className={`app-modal-icon-wrapper app-modal-icon--${type}`}>
          {icon}
        </div>
        <h3 className="app-modal-title">{title}</h3>
        <p className="app-modal-message">{message}</p>
        <div className={`app-modal-actions ${isConfirm ? 'app-modal-actions--two' : ''}`}>
          {isConfirm && (
            <button className="btn btn-secondary app-modal-btn" onClick={onCancel}>
              {cancelText || 'Cancelar'}
            </button>
          )}
          <button className={`btn btn-gradient app-modal-btn ${isConfirm ? 'app-modal-btn--confirm' : ''}`} onClick={onConfirm}>
            {confirmText || (isConfirm ? 'Confirmar' : 'OK')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppModal;
