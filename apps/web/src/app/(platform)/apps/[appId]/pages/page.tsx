import { BuilderCanvas } from "@/features/canvas/builder-canvas";

export default async function PagesPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  return <BuilderCanvas appId={appId} />;
}
