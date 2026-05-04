import React from 'react';

export const SplitLayout: React.FC<{ left: React.ReactNode; right: React.ReactNode }> = ({ left, right }) => {
  return (
    <div className="flex gap-4">
      <div className="w-1/3">{left}</div>
      <div className="flex-1">{right}</div>
    </div>
  );
};

export default SplitLayout;

