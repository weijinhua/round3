'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../../components/Button';

export interface FormPatternProps {
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormPattern({
  onSubmit,
  submitLabel = 'Submit',
  loading = false,
  children,
  className,
}: FormPatternProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn('flex flex-col gap-4', className)}
    >
      {children}
      <Button type="submit" loading={loading} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
