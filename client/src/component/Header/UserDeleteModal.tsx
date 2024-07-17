import { FC, MouseEvent } from "react";

import {
  buttons,
  cancleButton,
  summitButton,
  modalOverlay,
  modalContainer,
  deleteMessage,
  titleStyle,
} from "./UserDeleteModal.css";

interface UserDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  cancelText: string;
  confirmText: string;
  onClose: () => void;
  onConfirm: () => void;
}

const UserDeleteModal: FC<UserDeleteModalProps> = ({
  isOpen,
  title,
  message,
  cancelText,
  confirmText,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div className={modalOverlay} onClick={handleOverlayClick}>
      <div className={modalContainer} onClick={(e) => e.stopPropagation()}>
        <h2 className={titleStyle}>{title}</h2>
        <p className={deleteMessage}>{message}</p>
        <div className={buttons}>
          <button onClick={onClose} className={cancleButton}>
            {cancelText}
          </button>
          <button onClick={onConfirm} className={summitButton}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;
