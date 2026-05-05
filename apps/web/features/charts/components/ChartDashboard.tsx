'use client';

import { useEffect, useMemo, useState } from 'react';
import { AppLayout, SplitLayout } from '@charts-gen/ui';
import { generateChart, listCharts, saveChart, exportChart } from '../services/charts-api';
import type { ChartType, GeneratedChart, SavedChart } from '../types';
import { ChartArea } from './ChartArea';
import { DashboardSidebar } from './DashboardSidebar';
import { PromptBar } from './PromptBar';

export function ChartDashboard() {
  const [prompt, setPrompt] = useState('');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [chart, setChart] = useState<GeneratedChart | null>(null);
  const [history, setHistory] = useState<SavedChart[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSavedId, setLastSavedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listCharts().then((items) => {
      if (active) {
        setHistory(items);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const activeConfig = useMemo(() => chart?.config ?? null, [chart]);

  async function runGenerate(nextPrompt = prompt, nextChartType = chartType) {
    const trimmed = nextPrompt.trim();
    if (!trimmed) {
      setError('Enter a chart prompt first.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const generated = await generateChart(trimmed, nextChartType);
      setChart(generated);
      setLastSavedId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate chart.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const trimmed = prompt.trim();
    if (!trimmed) {
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const saved = await saveChart(trimmed, chartType);
      setHistory((current) => [saved, ...current.filter((item) => item.id !== saved.id)]);
      setLastSavedId(saved.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save chart.');
    } finally {
      setSaving(false);
    }
  }

  async function handleExport() {
    setExporting(true);
    setError(null);
    try {
      let exportId = lastSavedId;
      if (!exportId) {
        const saved = await saveChart(prompt.trim(), chartType);
        setHistory((current) => [saved, ...current.filter((item) => item.id !== saved.id)]);
        exportId = saved.id;
        setLastSavedId(saved.id);
      }
      if (!exportId) {
        throw new Error('Generate a chart before exporting.');
      }
      await exportChart(exportId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to export chart.');
    } finally {
      setExporting(false);
    }
  }

  async function handleChartTypeChange(nextType: ChartType) {
    setChartType(nextType);
    if (prompt.trim()) {
      await runGenerate(prompt, nextType);
    }
  }

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
