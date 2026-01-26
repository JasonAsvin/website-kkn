import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  contentClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  contentClassName = '',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 max-h-none z-[100] bg-black/90 overflow-auto flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {showCloseButton && (
        <button
          className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 transition"
          onClick={onClose}
          aria-label="Tutup"
        >
          &times;
        </button>
      )}

      <div
        className={`max-w-full max-h-[90vh] rounded-md shadow-2xl object-contain ${contentClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="text-white text-xl font-bold mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
