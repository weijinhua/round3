import * as React from 'react';
import { cn } from '../../utils/cn';

export interface StateShellProps {
  loading?: boolean;
  empty?: boolean;
  error?: string | null;
  emptyMessage?: string;
  children: React.ReactNode;
  className?: string;
}

export function StateShell({
  loading,
  empty,
  error,
  emptyMessage = 'No data',
  children,
  className,
}: StateShellProps) {
  if (loading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          'rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive',
          className
        )}
      >
        {error}
      </div>
    );
  }

  if (empty) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-2 p-8 text-muted-foreground', className)}>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
}
