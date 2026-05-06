'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@charts-gen/ui';
import type { SavedChart } from '../types';

interface DashboardSidebarProps {
  history: SavedChart[];
}

export function DashboardSidebar({ history }: DashboardSidebarProps) {
  const t = useTranslations('charts');
  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <Card>
        <CardHeader className="px-0">
          <CardTitle>{t('history')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0">
          {!history.length ? (
            <p className="text-sm text-muted-foreground">{t('noCharts')}</p>
          ) : (
            <ul className="space-y-2">
              {history.map((item) => (
                <li key={item.id} className="rounded-md border border-border p-3">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.config.chartType.toUpperCase()}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
