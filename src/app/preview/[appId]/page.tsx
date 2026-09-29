import Link from "next/link";
import { PreviewApp } from "@/features/builder/components/PreviewApp";

export default async function AppPreviewPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  return (
    <main className="standalone-preview">
      <header className="standalone-preview-bar">
        <Link className="brand" href="/apps"><span className="brand-mark">C</span> Canvas</Link>
        <span>Preview · Untitled app</span>
        <Link className="text-link" href={`/apps/${appId}/builder`}>Back to editor ↗</Link>
      </header>
      <PreviewApp appId={appId} />
    </main>
  );
}
