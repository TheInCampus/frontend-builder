import type { Metadata } from "next";
import { RuntimePage } from "@/app-engine/components/Page/RuntimePage";
import { sampleApplication } from "@/app-engine/examples/sampleApplication";
import { parseRuntimeApplication } from "@/app-engine/services";

export const metadata: Metadata = {
  title: sampleApplication.metadata.title,
  description: sampleApplication.metadata.description,
};

export default function EngineDemoPage() {
  const application = parseRuntimeApplication(sampleApplication);
  const page = application.pages.find((item) => item.path === "/");
  if (!page) return <main className="runtime-error">The sample page configuration is unavailable.</main>;
  return <RuntimePage application={application} page={page} />;
}
