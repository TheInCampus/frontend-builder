import type { Metadata } from "next";
import { BuilderShell } from "@/features/builder/components/BuilderShell";

export const metadata: Metadata = {
  title: "Builder",
};

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;
  return <BuilderShell appId={appId} />;
}
