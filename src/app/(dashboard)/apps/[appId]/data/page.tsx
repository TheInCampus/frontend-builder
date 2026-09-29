import type { Metadata } from "next";
import { DataModelingWorkspace } from "@/features/data-modeling/components/DataModelingWorkspace";

export const metadata: Metadata = {
  title: "Data model",
};

export default async function DataModelPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;
  return <DataModelingWorkspace appId={appId} />;
}
