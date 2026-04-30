import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'charts-generator-api',
      },
      error: null,
    };
  }
}
