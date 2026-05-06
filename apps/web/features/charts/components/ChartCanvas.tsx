'use client';

import React from 'react';
import type { ChartConfig, ChartType } from '../types';

const palette = ['#2563eb', '#16a34a', '#f97316', '#a855f7', '#dc2626'];

function renderPieSegments(values: number[], width: number, height: number): string {
  const total = values.reduce((sum, value) => sum + Math.max(value, 0), 0) || 1;
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 3;
  let offset = 0;

  return values
    .map((value, index) => {
      const start = offset / total;
      offset += Math.max(value, 0);
      const end = offset / total;
      const startAngle = start * Math.PI * 2 - Math.PI / 2;
      const endAngle = end * Math.PI * 2 - Math.PI / 2;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const largeArc = end - start > 0.5 ? 1 : 0;
      return `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${palette[index % palette.length]}" />`;
    })
    .join('');
}

function renderBarSeries(values: number[], width: number, height: number): string {
  const padding = 56;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const max = Math.max(...values, 1);
  const barWidth = innerWidth / Math.max(values.length, 1);

  return values
    .map((value, index) => {
      const barHeight = (Math.max(value, 0) / max) * innerHeight;
      const x = padding + index * barWidth + barWidth * 0.15;
      const y = padding + innerHeight - barHeight;
      return `<rect x="${x}" y="${y}" width="${barWidth * 0.7}" height="${barHeight}" rx="8" fill="${palette[0]}" />`;
    })
    .join('');
}

function renderLineSeries(values: number[], width: number, height: number): string {
  const padding = 56;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const max = Math.max(...values, 1);
  const points = values
    .map((value, index) => {
      const x = padding + (innerWidth * (values.length === 1 ? 0.5 : index / (values.length - 1)));
      const y = padding + innerHeight - (Math.max(value, 0) / max) * innerHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return [
    `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${padding + innerHeight}" stroke="#94a3b8" stroke-width="2" />`,
    `<line x1="${padding}" y1="${padding + innerHeight}" x2="${padding + innerWidth}" y2="${padding + innerHeight}" stroke="#94a3b8" stroke-width="2" />`,
    `<polyline fill="none" stroke="${palette[0]}" stroke-width="4" points="${points}" />`,
  ].join('');
}

export function buildChartMarkup(config: ChartConfig, width = 960, height = 540): string {
  const series = config.series[0] || { name: 'Value', data: [] };
  const values = series.data.length ? series.data : [0];

  if (config.chartType === 'pie') {
    return renderPieSegments(values, width, height);
  }

  if (config.chartType === 'line') {
    return renderLineSeries(values, width, height);
  }

  return renderBarSeries(values, width, height);
}

export function ChartCanvas({ config }: { config: ChartConfig }) {
  const markup = buildChartMarkup(config);
  return (
    <svg
      viewBox="0 0 960 540"
      role="img"
      aria-label={config.title}
      className="h-full w-full rounded-xl border border-border bg-background"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

export function chartTitleForType(chartType: ChartType) {
  return chartType.toUpperCase();
}
