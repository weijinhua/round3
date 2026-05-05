import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chart, ChartConfig, ChartType } from './entities/chart.entity';

export interface GeneratedChart {
  chartType: ChartType;
  title: string;
  config: ChartConfig;
}

export interface SaveGeneratedChartInput {
  prompt: string;
  chartType?: ChartType;
}

export function normalizePrompt(prompt: string): string {
  return prompt.trim().replace(/\s+/g, ' ');
}

function inferTitle(prompt: string): string {
  const normalized = normalizePrompt(prompt);
  const candidate = normalized || 'Generated chart';
  return candidate.length > 64 ? `${candidate.slice(0, 61)}...` : candidate;
}

function inferChartType(prompt: string, chartType?: ChartType): ChartType {
  if (chartType) {
    return chartType;
  }

  const normalized = normalizePrompt(prompt).toLowerCase();
  if (
    normalized.includes('pie') ||
    normalized.includes('share') ||
    normalized.includes('percentage') ||
    normalized.includes('percent') ||
    normalized.includes('占比') ||
    normalized.includes('比例')
  ) {
    return 'pie';
  }

  if (
    normalized.includes('trend') ||
    normalized.includes('time') ||
    normalized.includes('monthly') ||
    normalized.includes('yearly') ||
    normalized.includes('monthly') ||
    normalized.includes('month') ||
    normalized.includes('week') ||
    normalized.includes('day') ||
    normalized.includes('月') ||
    normalized.includes('年') ||
    normalized.includes('周') ||
    normalized.includes('日') ||
    normalized.includes('line')
  ) {
    return 'line';
  }

  return 'bar';
}

function extractPairs(prompt: string): Array<{ label: string; value: number }> {
  const pairs: Array<{ label: string; value: number }> = [];

  const chunks = normalizePrompt(prompt)
    .split(/[,\n;；、|]+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  for (const chunk of chunks) {
    const directMatch = chunk.match(/^(.+?)(?:[:=：]|\s+)(-?\d+(?:\.\d+)?)$/);
    if (directMatch) {
      const label = directMatch[1].trim().replace(/\s+/g, ' ');
      const value = Number(directMatch[2]);
      if (label && Number.isFinite(value)) {
        pairs.push({ label, value });
      }
      continue;
    }

    const numberMatch = chunk.match(/-?\d+(?:\.\d+)?/);
    if (numberMatch) {
      const label = chunk.replace(numberMatch[0], '').replace(/[:=：]/g, '').trim().replace(/\s+/g, ' ');
      const value = Number(numberMatch[0]);
      if (label && Number.isFinite(value)) {
        pairs.push({ label, value });
      }
    }
  }

  return pairs;
}

function buildConfig(prompt: string, chartType?: ChartType): GeneratedChart {
  const resolvedChartType = inferChartType(prompt, chartType);
  const title = inferTitle(prompt);
  const pairs = extractPairs(prompt);

  const labels = pairs.length > 0 ? pairs.map((pair) => pair.label) : ['Value'];
  const values = pairs.length > 0 ? pairs.map((pair) => pair.value) : [0];

  return {
    chartType: resolvedChartType,
    title,
    config: {
      chartType: resolvedChartType,
      title,
      xAxis: labels,
      series: [
        {
          name: resolvedChartType === 'pie' ? title : 'Value',
          data: values,
        },
      ],
    },
  };
}

function buildSeriesSvg(
  chartType: ChartType,
  chart: ChartConfig,
  width = 960,
  height = 540,
): string {
  const padding = 56;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const series = chart.series[0] || { name: 'Value', data: [] };
  const values = series.data.length ? series.data : [0];
  const max = Math.max(...values, 1);

  if (chartType === 'pie') {
    const total = values.reduce((sum, value) => sum + Math.max(value, 0), 0) || 1;
    let cumulative = 0;
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(innerWidth, innerHeight) / 3;
    const pie = values
      .map((value, index) => {
        const start = cumulative / total;
        cumulative += Math.max(value, 0);
        const end = cumulative / total;
        const startAngle = start * Math.PI * 2 - Math.PI / 2;
        const endAngle = end * Math.PI * 2 - Math.PI / 2;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const largeArc = end - start > 0.5 ? 1 : 0;
        const fill = ['#2563eb', '#16a34a', '#f97316', '#a855f7', '#dc2626'][index % 5];
        return `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${fill}" />`;
      })
      .join('');

    return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${chart.title}">${pie}</svg>`;
  }

  if (chartType === 'line') {
    const points = values
      .map((value, index) => {
        const x = padding + (innerWidth * (values.length === 1 ? 0.5 : index / (values.length - 1)));
        const y = padding + innerHeight - (Math.max(value, 0) / max) * innerHeight;
        return `${x},${y}`;
      })
      .join(' ');

    return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${chart.title}">
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${padding + innerHeight}" stroke="#94a3b8" stroke-width="2" />
      <line x1="${padding}" y1="${padding + innerHeight}" x2="${padding + innerWidth}" y2="${padding + innerHeight}" stroke="#94a3b8" stroke-width="2" />
      <polyline fill="none" stroke="#2563eb" stroke-width="4" points="${points}" />
    </svg>`;
  }

  const barWidth = innerWidth / Math.max(values.length, 1);
  const bars = values
    .map((value, index) => {
      const barHeight = (Math.max(value, 0) / max) * innerHeight;
      const x = padding + index * barWidth + barWidth * 0.15;
      const y = padding + innerHeight - barHeight;
      return `<rect x="${x}" y="${y}" width="${barWidth * 0.7}" height="${barHeight}" rx="8" fill="#2563eb" />`;
    })
    .join('');

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${chart.title}">
    <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${padding + innerHeight}" stroke="#94a3b8" stroke-width="2" />
    <line x1="${padding}" y1="${padding + innerHeight}" x2="${padding + innerWidth}" y2="${padding + innerHeight}" stroke="#94a3b8" stroke-width="2" />
    ${bars}
  </svg>`;
}

@Injectable()
export class ChartsService {
  constructor(@InjectRepository(Chart) private readonly chartsRepo: Repository<Chart>) {}

  generate(prompt: string, chartType?: ChartType): GeneratedChart {
    return buildConfig(prompt, chartType);
  }

  async saveGeneratedChart(userId: string, input: SaveGeneratedChartInput): Promise<Chart> {
    const generated = this.generate(input.prompt, input.chartType);
    const chart = this.chartsRepo.create({
      userId,
      title: generated.title,
      prompt: input.prompt,
      config: generated.config,
    });
    return this.chartsRepo.save(chart);
  }

  async list(userId: string): Promise<Chart[]> {
    return this.chartsRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getById(userId: string, id: string): Promise<Chart> {
    const chart = await this.chartsRepo.findOne({ where: { id, userId } });
    if (!chart) {
      throw new NotFoundException('Chart not found');
    }
    return chart;
  }

  async updateChartType(userId: string, id: string, chartType: ChartType): Promise<Chart> {
    const chart = await this.getById(userId, id);
    chart.config = {
      ...chart.config,
      chartType,
    };
    return this.chartsRepo.save(chart);
  }

  async delete(userId: string, id: string): Promise<{ message: string }> {
    const chart = await this.getById(userId, id);
    await this.chartsRepo.delete({ id: chart.id, userId });
    return { message: 'deleted' };
  }

  async exportSvg(userId: string, id: string): Promise<{ filename: string; svg: string }> {
    const chart = await this.getById(userId, id);
    return {
      filename: `${chart.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'chart'}.svg`,
      svg: buildSeriesSvg(chart.config.chartType, chart.config),
    };
  }
}

export const chartGenerationInternals = {
  buildConfig,
  buildSeriesSvg,
  inferChartType,
  inferTitle,
  extractPairs,
  normalizePrompt,
};
