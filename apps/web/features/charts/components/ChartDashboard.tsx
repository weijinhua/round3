'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { AppLayout, SplitLayout } from '@charts-gen/ui';
import { ChartArea } from './ChartArea';
import { DashboardSidebar } from './DashboardSidebar';
import { PromptBar } from './PromptBar';
import { useChartDashboard } from '../hooks/use-chart-dashboard';

export function ChartDashboard() {
  const t = useTranslations('charts');
  const {
    activeConfig,
    chart,
    chartType,
    error,
    exporting,
    handleChartTypeChange,
    handleExport,
    handleSave,
    history,
    loading,
    prompt,
    runGenerate,
    saving,
    setPrompt,
  } = useChartDashboard({
    emptyPromptError: t('emptyPromptError'),
    exportError: t('exportError'),
    generateError: t('generateError'),
    saveError: t('saveError'),
  });

  return (
    <AppLayout sidebar={<DashboardSidebar history={history} />}>
      <SplitLayout
        top={
          <ChartArea
            chart={activeConfig}
            chartTitle={chart?.title}
            loading={loading}
            saving={saving}
            exporting={exporting}
            error={error}
            onSave={handleSave}
            onExport={handleExport}
            onRetry={() => runGenerate()}
          />
        }
        bottom={
          <PromptBar
            prompt={prompt}
            chartType={chartType}
            loading={loading}
            error={error}
            onPromptChange={setPrompt}
            onChartTypeChange={handleChartTypeChange}
            onGenerate={() => runGenerate()}
          />
        }
      />
    </AppLayout>
  );
}
