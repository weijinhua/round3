import * as React from 'react';
import { cn } from '../../utils/cn';

export interface SplitLayoutProps {
  top?: React.ReactNode;
  bottom?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  ratio?: string;
  className?: string;
}

export function SplitLayout({
  top,
  bottom,
  left,
  right,
  direction = 'vertical',
  ratio,
  className,
}: SplitLayoutProps) {
  if (direction === 'horizontal') {
    return (
      <div className={cn('flex h-full', className)}>
        <div className="flex-1 overflow-auto" style={ratio ? { flex: 'none', width: ratio } : undefined}>
          {left}
        </div>
        <div className="flex-1 overflow-auto">
          {right}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex h-full flex-col', className)}>
      <div className="flex-1 overflow-auto">
        {top}
      </div>
      <div className="flex-shrink-0 border-t border-border">
        {bottom}
      </div>
    </div>
  );
}
