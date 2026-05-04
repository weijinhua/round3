import React from 'react';

export const EmptyState: React.FC<{ title?: string; description?: string }> = ({ title = 'No items', description }) => {
  return (
    <div role="status" className="p-6 text-center">
      <div className="text-lg font-semibold mb-2">{title}</div>
      {description && <div className="text-sm text-[var(--color-muted)]">{description}</div>}
    </div>
  );
};

export default EmptyState;

