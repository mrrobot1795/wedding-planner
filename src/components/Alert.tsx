import React from 'react';

interface AlertProps {
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onClose }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative">
    <span className="block sm:inline">{message}</span>
    {onClose && (
      <button
        onClick={onClose}
        className="absolute top-0 bottom-0 right-0 px-4 py-2"
        aria-label="Close alert"
      >
        <svg className="fill-current h-4 w-4" role="img" viewBox="0 0 20 20">
          <path d="M14.348 5.652a.5.5 0 10-.707-.708L10 8.586 6.359 4.944a.5.5 0 10-.707.708L9.293 9.293l-3.641 3.651a.5.5 0 00.707.707L10 9.999l3.641 3.651a.5.5 0 00.707-.707L10.707 9.293l3.641-3.641z" />
        </svg>
      </button>
    )}
  </div>
);

export default Alert;
