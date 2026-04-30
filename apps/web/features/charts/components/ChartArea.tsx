'use client';
import { useTranslations } from 'next-intl';
import { StateShell, Card, CardContent } from '@charts-gen/ui';

export function ChartArea() {
  const t = useTranslations('charts');
  return (
    <div className="flex h-full items-center justify-center p-8">
      <StateShell empty emptyMessage={t('noChartSelected')}>
        <Card>
          <CardContent>
            <p>{t('chartWillAppearHere')}</p>
          </CardContent>
        </Card>
      </StateShell>
    </div>
  );
}
