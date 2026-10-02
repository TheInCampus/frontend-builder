import { AppOverview } from "./_components/AppOverview";

export default async function AppOverviewPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;
  return <AppOverview appId={appId} />;
}
