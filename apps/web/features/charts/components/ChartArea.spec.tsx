import React from 'react';
import { act, create } from 'react-test-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ChartArea } from './ChartArea';
import { sampleChartConfig } from '../test-utils';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@charts-gen/ui', () => ({
  Button: ({ children, loading, ...props }: any) => <button {...props}>{loading ? 'loading' : children}</button>,
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('./ChartCanvas', () => ({
  ChartCanvas: ({ config }: any) => <div data-testid="chart-canvas">{config.title}</div>,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('ChartArea', () => {
  it('renders empty, loading, and error states', () => {
    const tree = create(
      <ChartArea
        chart={null}
        loading
        saving={false}
        exporting={false}
        error="Prompt must include numbers"
        onSave={() => undefined}
        onExport={() => undefined}
        onRetry={() => undefined}
      />,
    );

    expect(tree.root.findByType('button').children).toContain('retry');
    expect(tree.root.findByProps({ className: 'text-sm text-muted-foreground' }).children).toContain('noChartSelected');
  });

  it('renders a chart preview and invokes save, export, and retry handlers', () => {
    const onSave = vi.fn();
    const onExport = vi.fn();
    const onRetry = vi.fn();

    const tree = create(
      <ChartArea
        chart={sampleChartConfig}
        chartTitle="Quarterly"
        loading={false}
        saving={false}
        exporting={false}
        error="Unable to generate chart."
        onSave={onSave}
        onExport={onExport}
        onRetry={onRetry}
      />,
    );

    act(() => {
      const buttons = tree.root.findAllByType('button');
      buttons[0].props.onClick();
      buttons[1].props.onClick();
      buttons[2].props.onClick();
    });

    expect(tree.root.findByProps({ 'data-testid': 'chart-canvas' }).children).toContain('Q1 12, Q2 18');
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onExport).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
