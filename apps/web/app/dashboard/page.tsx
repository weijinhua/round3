import { AppLayout, SplitLayout } from '@charts-gen/ui';
import { DashboardSidebar } from '@/features/charts/components/DashboardSidebar';
import { ChartArea } from '@/features/charts/components/ChartArea';
import { PromptBar } from '@/features/charts/components/PromptBar';

export default function DashboardPage() {
  return (
    <AppLayout sidebar={<DashboardSidebar />}>
      <SplitLayout
        top={<ChartArea />}
        bottom={<PromptBar />}
      />
    </AppLayout>
  );
}
