import { useEffect, useMemo, useState } from 'react';
import { exportChart, generateChart, listCharts, saveChart } from '../services/charts-api';
import type { ChartType, GeneratedChart, SavedChart } from '../types';

export interface ChartDashboardMessages {
  emptyPromptError: string;
  generateError: string;
  saveError: string;
  exportError: string;
}

export function useChartDashboard(messages: ChartDashboardMessages) {
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

    listCharts()
      .then((items) => {
        if (active) {
          setHistory(items);
        }
      })
      .catch(() => {
        if (active) {
          setHistory([]);
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
      setError(messages.emptyPromptError);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const generated = await generateChart(trimmed, nextChartType);
      setChart(generated);
      setLastSavedId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : messages.generateError);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setError(messages.emptyPromptError);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const saved = await saveChart(trimmed, chartType);
      setHistory((current) => [saved, ...current.filter((item) => item.id !== saved.id)]);
      setLastSavedId(saved.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : messages.saveError);
    } finally {
      setSaving(false);
    }
  }

  async function handleExport() {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setError(messages.emptyPromptError);
      return;
    }

    setExporting(true);
    setError(null);
    try {
      let exportId = lastSavedId;
      if (!exportId) {
        const saved = await saveChart(trimmed, chartType);
        setHistory((current) => [saved, ...current.filter((item) => item.id !== saved.id)]);
        exportId = saved.id;
        setLastSavedId(saved.id);
      }
      if (!exportId) {
        throw new Error(messages.exportError);
      }
      await exportChart(exportId);
    } catch (err) {
      setError(err instanceof Error ? err.message : messages.exportError);
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

  return {
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
  };
}
