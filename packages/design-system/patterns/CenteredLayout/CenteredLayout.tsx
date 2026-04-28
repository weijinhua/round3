import * as React from 'react';
import { cn } from '../../utils/cn';

export interface CenteredLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function CenteredLayout({ children, className }: CenteredLayoutProps) {
  return (
    <div
      className={cn(
        'flex min-h-screen items-center justify-center bg-background px-4',
        className
      )}
    >
      {children}
    </div>
  );
}
