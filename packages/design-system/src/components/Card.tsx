import React from 'react';

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode;
  footer?: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({ title, footer, children, className = '', ...rest }) => {
  return (
    <div
      role="region"
      aria-label={typeof title === 'string' ? title : undefined}
      className={`bg-[var(--color-surface)] rounded-md shadow-sm p-4 ${className}`}
      {...rest}
    >
      {title && <div className="mb-2 font-semibold">{title}</div>}
      <div>{children}</div>
      {footer && <div className="mt-3 text-sm text-[var(--color-muted)]">{footer}</div>}
    </div>
  );
};

export default Card;

