import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import type { ChartType } from '../entities/chart.entity';

const chartTypes: ChartType[] = ['bar', 'line', 'pie'];

export class GenerateChartDto {
  @IsString()
  @MinLength(1)
  prompt: string;

  @IsOptional()
  @IsIn(chartTypes)
  chartType?: ChartType;
}
