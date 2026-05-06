'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import { Button, Card, CardContent } from '@charts-gen/ui';
import { ChartCanvas } from './ChartCanvas';
import type { ChartConfig } from '../types';

interface ChartAreaProps {
  chart: ChartConfig | null;
  chartTitle?: string;
  loading: boolean;
  saving: boolean;
  exporting: boolean;
  error: string | null;
  onSave: () => void;
  onExport: () => void;
  onRetry: () => void;
}

export function ChartArea({
  chart,
  chartTitle,
  loading,
  saving,
  exporting,
  error,
  onSave,
  onExport,
  onRetry,
}: ChartAreaProps) {
  const t = useTranslations('charts');
  return (
    <div className="flex h-full items-center justify-center p-8">
      <Card className="w-full max-w-5xl">
        <CardContent className="space-y-4 p-6">
          {loading ? <p>{t('loadingChart')}</p> : null}
          {error ? (
            <div className="flex items-center gap-3">
              <p className="text-sm text-red-600">{error}</p>
              <Button variant="secondary" size="sm" onClick={onRetry}>
                {t('retry')}
              </Button>
            </div>
          ) : null}
          {chart ? (
            <>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{chart.chartType.toUpperCase()}</p>
                  <h2 className="text-xl font-semibold">{chartTitle || chart.title}</h2>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" loading={saving} onClick={onSave}>
                    {t('saveChart')}
                  </Button>
                  <Button loading={exporting} onClick={onExport}>
                    {t('exportChart')}
                  </Button>
                </div>
              </div>
              <ChartCanvas config={chart} />
            </>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{t('noChartSelected')}</p>
              <p>{t('chartWillAppearHere')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
