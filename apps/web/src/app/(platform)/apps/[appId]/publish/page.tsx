import { FeaturePlaceholder } from "@/components/ui/feature-placeholder";

export default async function PublishPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  return (
    <FeaturePlaceholder
      title="Publish"
      description={`Configure publishing for ${appId}.`}
    />
  );
}
