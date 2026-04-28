'use client';
import { useTranslations } from 'next-intl';
import { CardHeader, CardTitle, StateShell } from '@charts-gen/ui';

export function DashboardSidebar() {
  const t = useTranslations('charts');
  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <CardHeader className="px-0">
        <CardTitle>{t('history')}</CardTitle>
      </CardHeader>
      <StateShell empty emptyMessage={t('noCharts')}>
        <span />
      </StateShell>
    </div>
  );
}
