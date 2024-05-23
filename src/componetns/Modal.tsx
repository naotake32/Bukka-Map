// components/Modal.tsx
import React from "react";
import "./Modal.css";

type ModalProps = {
  show: boolean;
  onClose: () => void;
  message: string;
};

const Modal: React.FC<ModalProps> = ({ show, onClose, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Error</h2>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default Modal;