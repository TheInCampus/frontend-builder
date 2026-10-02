import { AppOverview } from "@/features/apps/components/AppOverview";

export default async function AppOverviewPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;
  return <AppOverview appId={appId} />;
}
