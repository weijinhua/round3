import type { ChartConfig, ChartType, GeneratedChart } from '../types';

export function normalizePrompt(prompt: string): string {
  return prompt.trim().replace(/\s+/g, ' ');
}

export function inferChartType(prompt: string, chartType?: ChartType): ChartType {
  if (chartType) {
    return chartType;
  }

  const normalized = normalizePrompt(prompt).toLowerCase();
  if (
    normalized.includes('pie') ||
    normalized.includes('share') ||
    normalized.includes('percent') ||
    normalized.includes('percentage') ||
    normalized.includes('占比') ||
    normalized.includes('比例')
  ) {
    return 'pie';
  }

  if (
    normalized.includes('trend') ||
    normalized.includes('time') ||
    normalized.includes('month') ||
    normalized.includes('week') ||
    normalized.includes('day') ||
    normalized.includes('year') ||
    normalized.includes('月') ||
    normalized.includes('周') ||
    normalized.includes('日') ||
    normalized.includes('年') ||
    normalized.includes('line')
  ) {
    return 'line';
  }

  return 'bar';
}

function inferTitle(prompt: string): string {
  const normalized = normalizePrompt(prompt);
  const candidate = normalized || 'Generated chart';
  return candidate.length > 64 ? `${candidate.slice(0, 61)}...` : candidate;
}

function extractPairs(prompt: string): Array<{ label: string; value: number }> {
  const pairs: Array<{ label: string; value: number }> = [];
  const chunks = normalizePrompt(prompt)
    .split(/[,\n;；、|]+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  for (const chunk of chunks) {
    const directMatch = chunk.match(/^(.+?)(?:[:=：]|\s+)(-?\d+(?:\.\d+)?)$/);
    if (directMatch) {
      const label = directMatch[1].trim().replace(/\s+/g, ' ');
      const value = Number(directMatch[2]);
      if (label && Number.isFinite(value)) {
        pairs.push({ label, value });
      }
      continue;
    }

    const numberMatch = chunk.match(/-?\d+(?:\.\d+)?/);
    if (numberMatch) {
      const label = chunk.replace(numberMatch[0], '').replace(/[:=：]/g, '').trim().replace(/\s+/g, ' ');
      const value = Number(numberMatch[0]);
      if (label && Number.isFinite(value)) {
        pairs.push({ label, value });
      }
    }
  }

  return pairs;
}

export function buildChartPreview(prompt: string, chartType?: ChartType): GeneratedChart {
  const resolvedChartType = inferChartType(prompt, chartType);
  const title = inferTitle(prompt);
  const pairs = extractPairs(prompt);
  const labels = pairs.length > 0 ? pairs.map((pair) => pair.label) : ['Value'];
  const values = pairs.length > 0 ? pairs.map((pair) => pair.value) : [0];

  return {
    chartType: resolvedChartType,
    title,
    config: {
      chartType: resolvedChartType,
      title,
      xAxis: labels,
      series: [
        {
          name: resolvedChartType === 'pie' ? title : 'Value',
          data: values,
        },
      ],
    },
  };
}

export function updateChartType(config: ChartConfig, chartType: ChartType): ChartConfig {
  return {
    ...config,
    chartType,
    series: config.series.map((series) => ({
      ...series,
      name: chartType === 'pie' ? config.title : series.name,
    })),
  };
}
