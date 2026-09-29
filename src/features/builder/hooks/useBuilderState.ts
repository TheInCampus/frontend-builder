"use client";

import { useEffect, useState } from "react";
import { componentDefinitions } from "@/features/builder/components-registry";
import { loadPage, savePage } from "@/features/builder/serialization/storage";
import type { BuilderComponent, BuilderComponentType } from "@/features/builder/types";

export function useBuilderState(appId: string) {
  const [components, setComponents] = useState<BuilderComponent[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setComponents(loadPage(appId)?.components ?? []);
    setReady(true);
  }, [appId]);

  useEffect(() => {
    if (ready) savePage(appId, { components });
  }, [appId, components, ready]);

  function addComponent(type: BuilderComponentType) {
    const definition = componentDefinitions.find((item) => item.type === type);
    if (!definition) return;
    setComponents((items) => [
      ...items,
      {
        id: crypto.randomUUID(),
        type,
        label: definition.defaultLabel,
        text: definition.defaultText,
      },
    ]);
  }

  function updateComponent(id: string, updates: Partial<Pick<BuilderComponent, "label" | "text">>) {
    setComponents((items) => items.map((item) => item.id === id ? { ...item, ...updates } : item));
  }

  function removeComponent(id: string) {
    setComponents((items) => items.filter((item) => item.id !== id));
  }

  return { components, ready, addComponent, updateComponent, removeComponent };
}
