import { buildChartPreview } from './chart-generator';
import type { ChartType, GeneratedChart, SavedChart } from '../types';

const localHistory: SavedChart[] = [];

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as { data?: T; error?: string | null };
  if (!response.ok || payload.error) {
    throw new Error(payload.error || `Request failed with ${response.status}`);
  }
  return payload.data as T;
}

function authHeaders(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function generateChart(prompt: string, chartType?: ChartType, token?: string): Promise<GeneratedChart> {
  let response: Response;
  try {
    response = await fetch('/api/v1/charts/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(token),
      },
      body: JSON.stringify({ prompt, chartType: chartType ?? null }),
    });
  } catch {
    return buildChartPreview(prompt, chartType);
  }

  return parseResponse<GeneratedChart>(response);
}

export async function saveChart(prompt: string, chartType?: ChartType, token?: string): Promise<SavedChart> {
  let response: Response;
  try {
    response = await fetch('/api/v1/charts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(token),
      },
      body: JSON.stringify({ prompt, chartType: chartType ?? null }),
    });
  } catch {
    const generated = buildChartPreview(prompt, chartType);
    const saved: SavedChart = {
      id: `local-${Date.now()}`,
      title: generated.title,
      prompt,
      config: generated.config,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localHistory.unshift(saved);
    return saved;
  }

  return parseResponse<SavedChart>(response);
}

export async function listCharts(token?: string): Promise<SavedChart[]> {
  let response: Response;
  try {
    response = await fetch('/api/v1/charts', {
      headers: {
        ...authHeaders(token),
      },
    });
  } catch {
    return [...localHistory];
  }

  return parseResponse<SavedChart[]>(response);
}

export async function exportChart(id: string, token?: string): Promise<{ filename: string; svg: string }> {
  let response: Response;
  try {
    response = await fetch(`/api/v1/charts/${id}/export`, {
      method: 'POST',
      headers: {
        ...authHeaders(token),
      },
    });
  } catch {
    const chart = localHistory.find((item) => item.id === id);
    if (!chart) {
      throw new Error('Chart not found');
    }
    return {
      filename: `${chart.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'chart'}.svg`,
      svg: `<svg viewBox="0 0 960 540" role="img" aria-label="${chart.title}"></svg>`,
    };
  }

  return parseResponse<{ filename: string; svg: string }>(response);
}

export function clearLocalCharts() {
  localHistory.splice(0, localHistory.length);
}
