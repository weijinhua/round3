import React from 'react';

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || 'dialog'}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="fixed inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="bg-[var(--color-surface)] rounded-md p-4 z-10 max-w-lg w-full">
        {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
        <div>{children}</div>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-3 py-1 rounded bg-[var(--color-muted)] text-white">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

