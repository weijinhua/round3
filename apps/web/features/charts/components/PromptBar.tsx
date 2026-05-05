'use client';
import { useTranslations } from 'next-intl';
import { Button, Input } from '@charts-gen/ui';
import type { ChartType } from '../types';

interface PromptBarProps {
  prompt: string;
  chartType: ChartType;
  loading: boolean;
  error: string | null;
  onPromptChange: (prompt: string) => void;
  onChartTypeChange: (chartType: ChartType) => void;
  onGenerate: () => void;
}

export function PromptBar({
  prompt,
  chartType,
  loading,
  error,
  onPromptChange,
  onChartTypeChange,
  onGenerate,
}: PromptBarProps) {
  const t = useTranslations('charts');

  return (
    <div className="flex flex-col gap-4 border-t border-border p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">{t('chartType')}</span>
        {(['bar', 'line', 'pie'] as ChartType[]).map((type) => (
          <Button
            key={type}
            variant={chartType === type ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onChartTypeChange(type)}
          >
            {t(`chartTypes.${type}`)}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={t('promptPlaceholder')}
          onKeyDown={(e) => e.key === 'Enter' && onGenerate()}
        />
        <Button loading={loading} onClick={onGenerate}>
          {t('generate')}
        </Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
