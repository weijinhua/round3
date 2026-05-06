import type { ChartConfig, ChartType, GeneratedChart, SavedChart } from './types';

export const samplePrompt = 'Q1 12, Q2 18';
export const sampleChartType: ChartType = 'line';

export const sampleChartConfig: ChartConfig = {
  chartType: sampleChartType,
  title: 'Q1 12, Q2 18',
  xAxis: ['Q1', 'Q2'],
  series: [
    {
      name: 'Value',
      data: [12, 18],
    },
  ],
};

export const sampleGeneratedChart: GeneratedChart = {
  chartType: sampleChartType,
  title: sampleChartConfig.title,
  config: sampleChartConfig,
};

export const sampleSavedChart: SavedChart = {
  id: 'chart-1',
  title: sampleChartConfig.title,
  prompt: samplePrompt,
  config: sampleChartConfig,
  createdAt: '2026-05-05T00:00:00.000Z',
  updatedAt: '2026-05-05T00:00:00.000Z',
};
