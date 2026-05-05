export type ChartType = 'bar' | 'line' | 'pie';

export interface ChartSeries {
  name: string;
  data: number[];
}

export interface ChartConfig {
  chartType: ChartType;
  title: string;
  xAxis: string[];
  series: ChartSeries[];
}

export interface GeneratedChart {
  chartType: ChartType;
  title: string;
  config: ChartConfig;
}

export interface SavedChart {
  id: string;
  title: string;
  prompt: string;
  config: ChartConfig;
  createdAt?: string;
  updatedAt?: string;
}
