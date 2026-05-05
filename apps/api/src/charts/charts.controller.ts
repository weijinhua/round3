import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChartsService } from './charts.service';
import { GenerateChartDto } from './dto/generate-chart.dto';
import { UpdateChartTypeDto } from './dto/update-chart-type.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user: { sub?: string };
}

@Controller('charts')
@UseGuards(JwtAuthGuard)
export class ChartsController {
  constructor(private readonly chartsService: ChartsService) {}

  @Post('generate')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async generate(@Body() body: GenerateChartDto) {
    return { data: this.chartsService.generate(body.prompt, body.chartType), error: null };
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async save(@Req() req: AuthenticatedRequest, @Body() body: GenerateChartDto) {
    const chart = await this.chartsService.saveGeneratedChart(req.user.sub || '', body);
    return { data: chart, error: null };
  }

  @Get()
  async list(@Req() req: AuthenticatedRequest) {
    return { data: await this.chartsService.list(req.user.sub || ''), error: null };
  }

  @Get(':id')
  async get(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return { data: await this.chartsService.getById(req.user.sub || '', id), error: null };
  }

  @Patch(':id/type')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateType(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: UpdateChartTypeDto,
  ) {
    return { data: await this.chartsService.updateChartType(req.user.sub || '', id, body.chartType), error: null };
  }

  @Delete(':id')
  async remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return { data: await this.chartsService.delete(req.user.sub || '', id), error: null };
  }

  @Post(':id/export')
  async export(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return { data: await this.chartsService.exportSvg(req.user.sub || '', id), error: null };
  }
}
