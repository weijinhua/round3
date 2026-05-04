import React from 'react';

export type IconProps = {
  name: 'close' | 'check' | 'chevron-down' | string;
  className?: string;
  ariaHidden?: boolean;
};

export const Icon: React.FC<IconProps> = ({ name, className = '', ariaHidden = true }) => {
  // lightweight icon registry using tokens file placeholders
  const registry: Record<string, string> = {
    close: '<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M6 6l12 12M6 18L18 6\"/></svg>',
    check: '<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M5 13l4 4L19 7\"/></svg>',
    'chevron-down': '<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"><path d=\"M6 9l6 6 6-6\"/></svg>',
  };
  const svg = registry[name] || '';
  return (
    <span
      className={`inline-block align-middle ${className}`}
      role="img"
      aria-hidden={ariaHidden}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default Icon;

