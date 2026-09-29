import { FeaturePlaceholder } from "@/components/ui/feature-placeholder";

export default async function ModelPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  return (
    <FeaturePlaceholder
      title="Data model"
      description={`Define objects, fields, and relationships for ${appId}.`}
    />
  );
}
