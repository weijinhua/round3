import type { Chart, ChartConfig, ChartType } from './entities/chart.entity';

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

export const sampleChart: Chart = {
  id: 'chart-1',
  userId: 'user-1',
  title: sampleChartConfig.title,
  prompt: samplePrompt,
  config: sampleChartConfig,
  createdAt: new Date('2026-05-05T00:00:00.000Z'),
  updatedAt: new Date('2026-05-05T00:00:00.000Z'),
};
