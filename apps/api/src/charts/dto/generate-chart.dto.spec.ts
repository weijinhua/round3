import { describe, expect, it } from 'vitest';
import { validateSync } from 'class-validator';
import { GenerateChartDto } from './generate-chart.dto';

describe('GenerateChartDto', () => {
  it('accepts a prompt with an optional chart type', () => {
    const dto = Object.assign(new GenerateChartDto(), {
      prompt: 'Q1 12, Q2 18',
      chartType: 'line',
    });

    expect(validateSync(dto)).toHaveLength(0);
  });

  it('rejects an empty prompt', () => {
    const dto = Object.assign(new GenerateChartDto(), {
      prompt: '',
    });

    expect(validateSync(dto).map((error) => error.property)).toContain('prompt');
  });
});
