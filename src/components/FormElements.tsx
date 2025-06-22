import React from 'react';

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  options?: { value: string; label: string }[];
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  multiline = false,
  rows = 3,
  options = [],
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-teal-100 mb-1"
      >
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {(() => {
        const inputClasses =
          'w-full p-2 bg-teal-800/50 text-white border border-teal-500 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder-teal-300/60';

        if (multiline) {
          return (
            <textarea
              id={id}
              name={id}
              rows={rows}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              required={required}
              className={inputClasses}
            />
          );
        }

        if (type === 'select') {
          return (
            <select
              id={id}
              name={id}
              value={value}
              onChange={onChange}
              required={required}
              className={inputClasses}
            >
              <option value="">Select an option</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        }

        return (
          <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={inputClasses}
          />
        );
      })()}
    </div>
  );
};

interface FormButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const FormButton: React.FC<FormButtonProps> = ({
  type = 'button',
  onClick,
  variant = 'primary',
  disabled = false,
  children,
  fullWidth = false,
}) => {
  const getButtonClasses = () => {
    const baseClasses =
      'px-4 py-2 rounded-md font-medium transition-all border';
    const widthClass = fullWidth ? 'w-full' : '';

    switch (variant) {
      case 'primary':
        return `${baseClasses} ${widthClass} bg-teal-600 hover:bg-teal-500 text-white border-teal-400 shadow-sm disabled:bg-teal-800 disabled:text-teal-200 disabled:cursor-not-allowed`;
      case 'secondary':
        return `${baseClasses} ${widthClass} bg-teal-800 hover:bg-teal-700 text-teal-200 hover:text-white border-teal-600 shadow-sm disabled:bg-teal-900 disabled:text-teal-400 disabled:cursor-not-allowed`;
      case 'danger':
        return `${baseClasses} ${widthClass} bg-red-600 hover:bg-red-500 text-white border-red-400 shadow-sm disabled:bg-red-800 disabled:text-red-200 disabled:cursor-not-allowed`;
      default:
        return baseClasses;
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={getButtonClasses()}
    >
      {children}
    </button>
  );
};
