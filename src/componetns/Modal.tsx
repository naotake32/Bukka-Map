import React from "react";
import "./Modal.css";

type ModalProps = {
  show: boolean;
  onClose: () => void;
  message: string;
  isError: boolean; // エラーかどうかのフラグ
};

const Modal: React.FC<ModalProps> = ({ show, onClose, message, isError }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {isError && <h2>Error</h2>}
        <p className={isError ? "error-message" : "normal-message"}>{message.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default Modal;