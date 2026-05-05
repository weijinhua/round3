import { describe, expect, it, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { ChartsService, chartGenerationInternals } from './charts.service';
import type { Chart } from './entities/chart.entity';

describe('ChartsService', () => {
  it('builds a generated chart from prompt pairs', () => {
    const result = chartGenerationInternals.buildConfig('Q1 12, Q2 18', 'line');

    expect(result.chartType).toBe('line');
    expect(result.config.chartType).toBe('line');
    expect(result.config.xAxis).toEqual(['Q1', 'Q2']);
    expect(result.config.series[0].data).toEqual([12, 18]);
  });

  it('saves a generated chart for the current user', async () => {
    const saved: Chart[] = [];
    const repo = {
      create: vi.fn((data) => ({ ...data })),
      save: vi.fn(async (chart) => {
        const next = { ...chart, id: 'chart-1' } as Chart;
        saved.push(next);
        return next;
      }),
      find: vi.fn(),
      findOne: vi.fn(),
      delete: vi.fn(),
    } as any;

    const service = new ChartsService(repo);
    const chart = await service.saveGeneratedChart('user-1', {
      prompt: 'Sales Jan 100, Sales Feb 120',
      chartType: 'bar',
    });

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        prompt: 'Sales Jan 100, Sales Feb 120',
      }),
    );
    expect(chart.id).toBe('chart-1');
    expect(saved).toHaveLength(1);
  });

  it('throws when a chart cannot be found for the user', async () => {
    const service = new ChartsService({
      findOne: vi.fn().mockResolvedValue(null),
      find: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    } as any);

    await expect(service.getById('user-1', 'missing')).rejects.toBeInstanceOf(NotFoundException);
  });
});
