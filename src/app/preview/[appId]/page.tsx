import { PreviewApp } from "@/features/builder/components/PreviewApp";
import { StandalonePreviewBar } from "@/components/StandalonePreviewBar";

export default async function AppPreviewPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  return (
    <main className="standalone-preview">
      <StandalonePreviewBar appId={appId} />
      <PreviewApp appId={appId} />
    </main>
  );
}
