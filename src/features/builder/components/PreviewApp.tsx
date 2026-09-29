"use client";

import { useEffect, useState } from "react";
import { loadPage } from "@/features/builder/serialization/storage";
import type { BuilderComponent } from "@/features/builder/types";
import { PreviewPanel } from "./PreviewPanel";

export function PreviewApp({ appId }: { appId: string }) {
  const [components, setComponents] = useState<BuilderComponent[]>([]);

  useEffect(() => {
    setComponents(loadPage(appId)?.components ?? []);
  }, [appId]);

  return <PreviewPanel components={components} />;
}
