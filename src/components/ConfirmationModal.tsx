import React from 'react';
import Modal from './Modal';
import { FormButton } from './FormElements';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="mb-4 text-teal-100">{message}</p>
      <div className="flex justify-end space-x-2">
        <FormButton variant="secondary" onClick={onClose}>
          {cancelText}
        </FormButton>
        <FormButton
          variant="danger"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmText}
        </FormButton>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
