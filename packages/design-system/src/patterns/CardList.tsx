import React from 'react';

export const CardList: React.FC<{ items: React.ReactNode[]; className?: string }> = ({ items, className = '' }) => {
  return <div className={`grid grid-cols-3 gap-4 ${className}`}>{items.map((it, i) => <div key={i}>{it}</div>)}</div>;
};

export default CardList;

