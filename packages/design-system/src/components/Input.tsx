import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  id?: string;
};

export const Input: React.FC<InputProps> = ({ label, id, className = '', ...rest }) => {
  return (
    <label className="flex flex-col text-sm">
      {label && <span className="mb-1">{label}</span>}
      <input
        id={id}
        className={`border rounded-md px-2 py-1 focus:ring-2 focus:outline-none ${className}`}
        {...rest}
      />
    </label>
  );
};

export default Input;

