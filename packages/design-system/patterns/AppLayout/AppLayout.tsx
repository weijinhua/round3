import * as React from 'react';
import { cn } from '../../utils/cn';

export interface AppLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  sidebarCollapsed?: boolean;
  className?: string;
}

export function AppLayout({
  sidebar,
  children,
  sidebarCollapsed = false,
  className,
}: AppLayoutProps) {
  return (
    <div className={cn('flex h-screen overflow-hidden bg-background', className)}>
      <aside
        className={cn(
          'flex-shrink-0 border-r border-border bg-card transition-all duration-200 overflow-y-auto',
          sidebarCollapsed ? 'w-0 border-r-0' : 'w-64'
        )}
      >
        {!sidebarCollapsed && sidebar}
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
