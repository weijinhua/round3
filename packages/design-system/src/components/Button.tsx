import React from 'react';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...rest }) => {
  const base = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2';
  const variants: Record<string, string> = {
    primary: 'bg-[var(--color-primary)] text-white px-3 py-1.5',
    secondary: 'bg-[var(--color-surface)] text-[var(--color-neutral-900)] border px-3 py-1.5',
    ghost: 'bg-transparent text-[var(--color-primary)] px-2 py-1',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;

