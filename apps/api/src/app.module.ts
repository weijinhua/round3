import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database.module';
import { ChartsModule } from './charts/charts.module';

@Module({
  imports: [DatabaseModule, HealthModule, AuthModule, ChartsModule],
})
export class AppModule {}
