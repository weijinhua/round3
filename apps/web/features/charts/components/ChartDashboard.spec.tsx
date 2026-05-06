import React from 'react';
import { act, create } from 'react-test-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ChartDashboard } from './ChartDashboard';
import { sampleGeneratedChart, sampleSavedChart } from '../test-utils';
import * as chartsApi from '../services/charts-api';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('../services/charts-api', () => ({
  generateChart: vi.fn(),
  listCharts: vi.fn(),
  saveChart: vi.fn(),
  exportChart: vi.fn(),
}));

vi.mock('@charts-gen/ui', () => ({
  AppLayout: ({ sidebar, children }: any) => (
    <div data-testid="app-layout">
      <aside data-testid="sidebar">{sidebar}</aside>
      <main data-testid="content">{children}</main>
    </div>
  ),
  SplitLayout: ({ top, bottom }: any) => (
    <div data-testid="split-layout">
      <section data-testid="split-top">{top}</section>
      <section data-testid="split-bottom">{bottom}</section>
    </div>
  ),
  Button: ({ children, loading, ...props }: any) => <button {...props}>{loading ? 'loading' : children}</button>,
  Input: (props: any) => <input {...props} />,
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
}));

vi.mock('./ChartCanvas', () => ({
  ChartCanvas: ({ config }: any) => <div data-testid="chart-canvas">{config.title}</div>,
}));

afterEach(() => {
  vi.clearAllMocks();
});

function getButtonText(button: any) {
  return Array.isArray(button.children) ? button.children.join('') : String(button.children ?? '');
}

describe('ChartDashboard', () => {
  it('composes the dashboard and renders a generated preview', async () => {
    vi.mocked(chartsApi.listCharts).mockResolvedValue([sampleSavedChart]);
    vi.mocked(chartsApi.generateChart).mockResolvedValue(sampleGeneratedChart);
    vi.mocked(chartsApi.saveChart).mockResolvedValue(sampleSavedChart);
    vi.mocked(chartsApi.exportChart).mockResolvedValue({ filename: 'q1-12-q2-18.svg', svg: '<svg />' });

    let tree: ReturnType<typeof create>;
    await act(async () => {
      tree = create(<ChartDashboard />);
    });

    expect(tree!.root.findByProps({ 'data-testid': 'app-layout' })).toBeTruthy();
    expect(tree!.root.findByProps({ 'data-testid': 'split-layout' })).toBeTruthy();
    expect(tree!.root.findAllByType('p').some((node) => node.children.join('').includes(sampleSavedChart.title))).toBe(true);
    expect(tree!.root.findAllByType('p').some((node) => node.children.join('').includes('noChartSelected'))).toBe(true);

    await act(async () => {
      tree!.root.findByType('input').props.onChange({ target: { value: sampleSavedChart.prompt } });
    });

    await act(async () => {
      tree!.root.findAllByType('button').find((button) => getButtonText(button) === 'generate').props.onClick();
    });

    expect(chartsApi.generateChart).toHaveBeenCalledWith(sampleSavedChart.prompt, 'bar');
    expect(tree!.root.findByProps({ 'data-testid': 'chart-canvas' }).children.join('')).toContain(sampleGeneratedChart.title);

    await act(async () => {
      tree!.root.findAllByType('button').find((button) => getButtonText(button) === 'chartTypes.line').props.onClick();
    });

    expect(chartsApi.generateChart).toHaveBeenLastCalledWith(sampleSavedChart.prompt, 'line');
  });

  it('surfaces generation errors and exposes retry copy', async () => {
    vi.mocked(chartsApi.listCharts).mockResolvedValue([]);
    vi.mocked(chartsApi.generateChart).mockRejectedValue(new Error('Prompt must include numbers'));

    let tree: ReturnType<typeof create>;
    await act(async () => {
      tree = create(<ChartDashboard />);
    });

    await act(async () => {
      tree!.root.findByType('input').props.onChange({ target: { value: 'hello world' } });
    });

    await act(async () => {
      tree!.root.findAllByType('button').find((button) => getButtonText(button) === 'generate').props.onClick();
    });

    expect(
      tree!.root.findAllByType('p').some((node) => node.children.join('').includes('Prompt must include numbers')),
    ).toBe(true);
    expect(tree!.root.findAllByType('button').some((button) => getButtonText(button) === 'retry')).toBe(true);
  });
});
