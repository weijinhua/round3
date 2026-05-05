import { describe, expect, it } from 'vitest';
import { buildChartPreview, inferChartType, normalizePrompt, updateChartType } from './chart-generator';

describe('chart-generator', () => {
  it('normalizes prompt spacing', () => {
    expect(normalizePrompt('  Sales   Jan   10  ')).toBe('Sales Jan 10');
  });

  it('infers chart type from prompt context', () => {
    expect(inferChartType('monthly sales trend')).toBe('line');
    expect(inferChartType('market share breakdown')).toBe('pie');
    expect(inferChartType('revenue by region')).toBe('bar');
  });

  it('builds a chart preview from prompt pairs', () => {
    const chart = buildChartPreview('Q1 10, Q2 12', 'bar');

    expect(chart.chartType).toBe('bar');
    expect(chart.config.xAxis).toEqual(['Q1', 'Q2']);
    expect(chart.config.series[0].data).toEqual([10, 12]);
  });

  it('updates chart type without changing the data set', () => {
    const chart = buildChartPreview('Q1 10, Q2 12', 'bar');
    const updated = updateChartType(chart.config, 'pie');

    expect(updated.chartType).toBe('pie');
    expect(updated.series[0].data).toEqual([10, 12]);
  });
});
