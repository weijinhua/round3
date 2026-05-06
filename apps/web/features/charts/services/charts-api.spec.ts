import { afterEach, describe, expect, it, vi } from 'vitest';
import { clearLocalCharts, exportChart, generateChart, listCharts, saveChart } from './charts-api';

describe('charts-api', () => {
  afterEach(() => {
    clearLocalCharts();
    vi.restoreAllMocks();
  });

  it('falls back to a local generated chart when the API is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    const chart = await generateChart('Q1 10, Q2 12', 'line');

    expect(chart.chartType).toBe('line');
    expect(chart.config.series[0].data).toEqual([10, 12]);
  });

  it('surfaces API validation errors instead of falling back locally', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Prompt must include numbers' }),
      }),
    );

    await expect(generateChart('hello world')).rejects.toThrow('Prompt must include numbers');
  });

  it('stores saved charts locally when the API is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    const saved = await saveChart('Q1 10, Q2 12', 'bar');
    const history = await listCharts();

    expect(saved.id).toMatch(/^local-/);
    expect(history).toHaveLength(1);
    expect(history[0].title).toBe(saved.title);
  });

  it('exports a saved local chart when the API is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    const saved = await saveChart('Q1 10, Q2 12', 'bar');
    const exported = await exportChart(saved.id);

    expect(exported.filename).toContain('q1-10-q2-12');
    expect(exported.svg).toContain('<svg');
  });
});
