import React from 'react';

export const PageShell: React.FC<{ header?: React.ReactNode; sidebar?: React.ReactNode; children?: React.ReactNode }> = ({
  header,
  sidebar,
  children,
}) => {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <header className="p-4 border-b">{header}</header>
      <div className="flex">
        {sidebar && <aside className="w-64 p-4 border-r">{sidebar}</aside>}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default PageShell;

