import { describe, expect, it } from 'vitest';
import { validateSync } from 'class-validator';
import { UpdateChartTypeDto } from './update-chart-type.dto';

describe('UpdateChartTypeDto', () => {
  it('accepts allowed chart types', () => {
    const dto = Object.assign(new UpdateChartTypeDto(), {
      chartType: 'pie',
    });

    expect(validateSync(dto)).toHaveLength(0);
  });

  it('rejects unknown chart types', () => {
    const dto = Object.assign(new UpdateChartTypeDto(), {
      chartType: 'scatter',
    });

    expect(validateSync(dto).map((error) => error.property)).toContain('chartType');
  });
});
