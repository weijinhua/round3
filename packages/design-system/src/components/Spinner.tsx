import React from 'react';

export const Spinner: React.FC<{ size?: number; label?: string }> = ({ size = 24, label = 'Loading' }) => {
  return (
    <span role="status" aria-live="polite" className="inline-flex items-center">
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.2" />
        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
};

export default Spinner;

