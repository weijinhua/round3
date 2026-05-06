import React from 'react';
import { act, create } from 'react-test-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PromptBar } from './PromptBar';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@charts-gen/ui', () => ({
  Button: ({ children, loading, ...props }: any) => <button {...props}>{loading ? 'loading' : children}</button>,
  Input: (props: any) => <input {...props} />,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('PromptBar', () => {
  it('submits prompts and switches chart types', () => {
    const onPromptChange = vi.fn();
    const onChartTypeChange = vi.fn();
    const onGenerate = vi.fn();

    const tree = create(
      <PromptBar
        prompt=""
        chartType="bar"
        loading={false}
        error={null}
        onPromptChange={onPromptChange}
        onChartTypeChange={onChartTypeChange}
        onGenerate={onGenerate}
      />,
    );

    act(() => {
      tree.root.findByType('input').props.onChange({ target: { value: 'Q1 12, Q2 18' } });
    });

    act(() => {
      tree.root.findAllByType('button').find((button) => button.children.join('') === 'chartTypes.bar').props.onClick();
    });

    act(() => {
      tree.root.findAllByType('button').find((button) => button.children.join('') === 'generate').props.onClick();
    });

    act(() => {
      tree.root.findByType('input').props.onKeyDown({ key: 'Enter' });
    });

    expect(onPromptChange).toHaveBeenCalledWith('Q1 12, Q2 18');
    expect(onChartTypeChange).toHaveBeenCalledWith('bar');
    expect(onGenerate).toHaveBeenCalledTimes(2);
  });

  it('shows loading and error copy', () => {
    const tree = create(
      <PromptBar
        prompt="Q1 12"
        chartType="line"
        loading
        error="Prompt must include numbers"
        onPromptChange={() => undefined}
        onChartTypeChange={() => undefined}
        onGenerate={() => undefined}
      />,
    );

    expect(tree.root.findAllByType('button').some((button) => button.children.join('').includes('loading'))).toBe(true);
    expect(tree.root.findByProps({ className: 'text-sm text-red-600' }).children).toContain('Prompt must include numbers');
  });
});
