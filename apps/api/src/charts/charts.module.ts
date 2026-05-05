import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChartsController } from './charts.controller';
import { ChartsService } from './charts.service';
import { Chart } from './entities/chart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chart])],
  controllers: [ChartsController],
  providers: [ChartsService],
  exports: [ChartsService],
})
export class ChartsModule {}
