import { describe, expect, it, vi } from 'vitest';
import { ChartsController } from './charts.controller';
import { sampleChart } from './test-utils';

describe('ChartsController', () => {
  it('returns generated chart data in the API envelope', async () => {
    const service = {
      generate: vi.fn().mockReturnValue({
        chartType: 'bar',
        title: 'Sales',
        config: {
          chartType: 'bar',
          title: 'Sales',
          xAxis: ['Jan'],
          series: [{ name: 'Value', data: [10] }],
        },
      }),
    } as any;
    const controller = new ChartsController(service);

    const response = await controller.generate({ prompt: 'Jan 10', chartType: 'bar' });

    expect(service.generate).toHaveBeenCalledWith('Jan 10', 'bar');
    expect(response).toEqual(
      expect.objectContaining({
        error: null,
        data: expect.objectContaining({ chartType: 'bar' }),
      }),
    );
  });

  it('uses the authenticated user for saved charts', async () => {
    const service = {
      saveGeneratedChart: vi.fn().mockResolvedValue({ id: 'chart-1' }),
    } as any;
    const controller = new ChartsController(service);

    const response = await controller.save({ user: { sub: 'user-1' } }, { prompt: 'Jan 10', chartType: 'bar' });

    expect(service.saveGeneratedChart).toHaveBeenCalledWith('user-1', { prompt: 'Jan 10', chartType: 'bar' });
    expect(response.data).toEqual({ id: 'chart-1' });
  });

  it('updates the chart type for the authenticated user', async () => {
    const service = {
      updateChartType: vi.fn().mockResolvedValue({ ...sampleChart, config: { ...sampleChart.config, chartType: 'pie' } }),
    } as any;
    const controller = new ChartsController(service);

    const response = await controller.updateType({ user: { sub: 'user-1' } }, 'chart-1', { chartType: 'pie' });

    expect(service.updateChartType).toHaveBeenCalledWith('user-1', 'chart-1', 'pie');
    expect(response.data.config.chartType).toBe('pie');
  });
});
