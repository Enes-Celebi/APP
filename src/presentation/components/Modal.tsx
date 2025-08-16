// APP/src/presentation/components/Modal.tsx
import React from "react";

export type ModalProps = {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-11/12 h-4/5 md:w-4/5 md:h-4/5 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default Modal;
