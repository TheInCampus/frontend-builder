"use client";

import { useEffect } from "react";
import { loadPage, savePage } from "@/features/builder/serialization/storage";
import type { BuilderComponent, BuilderComponentType } from "@/types/json-schema";
import { useBuilderStore } from "@/features/builder/state/store";

export function useBuilderState(appId: string) {
  const components = useBuilderStore((state) => state.apps[appId]?.components ?? EMPTY_COMPONENTS);
  const ready = useBuilderStore((state) => state.apps[appId]?.ready ?? false);
  const initialize = useBuilderStore((state) => state.initialize);
  const addComponentAction = useBuilderStore((state) => state.addComponent);
  const updateComponentAction = useBuilderStore((state) => state.updateComponent);
  const removeComponentAction = useBuilderStore((state) => state.removeComponent);
  const reorderComponents = useBuilderStore((state) => state.reorderComponents);

  useEffect(() => {
    if (!ready) initialize(appId, loadPage(appId)?.components ?? []);
  }, [appId, initialize, ready]);

  useEffect(() => {
    if (ready) savePage(appId, { components });
  }, [appId, components, ready]);

  function addComponent(type: BuilderComponentType) {
    addComponentAction(appId, type);
  }

  function updateComponent(id: string, updates: Partial<Pick<BuilderComponent, "label" | "text">>) {
    updateComponentAction(appId, id, updates);
  }

  function removeComponent(id: string) {
    removeComponentAction(appId, id);
  }

  return { components, ready, addComponent, updateComponent, removeComponent, reorderComponents };
}

const EMPTY_COMPONENTS: BuilderComponent[] = [];
