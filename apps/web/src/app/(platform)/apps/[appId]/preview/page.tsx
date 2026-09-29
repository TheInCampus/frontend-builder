import { FeaturePlaceholder } from "@/components/ui/feature-placeholder";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  return (
    <FeaturePlaceholder
      title="Preview"
      description={`Preview the published experience for ${appId}.`}
    />
  );
}
