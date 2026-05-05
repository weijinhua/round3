import { IsIn } from 'class-validator';
import type { ChartType } from '../entities/chart.entity';

const chartTypes: ChartType[] = ['bar', 'line', 'pie'];

export class UpdateChartTypeDto {
  @IsIn(chartTypes)
  chartType: ChartType;
}
