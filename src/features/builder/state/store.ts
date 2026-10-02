import { create } from "zustand";
import { componentDefinitions } from "@/features/builder/components/registry";
import type { BuilderComponent, BuilderComponentType } from "@/types/json-schema";

type AppDraft = {
  components: BuilderComponent[];
  ready: boolean;
};

type BuilderStore = {
  apps: Record<string, AppDraft>;
  initialize: (appId: string, components: BuilderComponent[]) => void;
  addComponent: (appId: string, type: BuilderComponentType) => void;
  updateComponent: (appId: string, id: string, updates: Partial<Pick<BuilderComponent, "label" | "text">>) => void;
  removeComponent: (appId: string, id: string) => void;
  reorderComponents: (appId: string, fromId: string, toId: string) => void;
};

function updateApp(
  apps: Record<string, AppDraft>,
  appId: string,
  update: (draft: AppDraft) => AppDraft,
) {
  const draft = apps[appId];
  return draft ? { ...apps, [appId]: update(draft) } : apps;
}

export const useBuilderStore = create<BuilderStore>((set) => ({
  apps: {},
  initialize: (appId, components) => set((state) => ({
    apps: {
      ...state.apps,
      [appId]: state.apps[appId]?.ready
        ? state.apps[appId]
        : { components, ready: true },
    },
  })),
  addComponent: (appId, type) => {
    const definition = componentDefinitions.find((item) => item.type === type);
    if (!definition) return;
    set((state) => ({
      apps: updateApp(state.apps, appId, (draft) => ({
        ...draft,
        components: [...draft.components, {
          id: crypto.randomUUID(),
          type,
          label: definition.defaultLabel,
          text: definition.defaultText,
        }],
      })),
    }));
  },
  updateComponent: (appId, id, updates) => set((state) => ({
    apps: updateApp(state.apps, appId, (draft) => ({
      ...draft,
      components: draft.components.map((item) => item.id === id ? { ...item, ...updates } : item),
    })),
  })),
  removeComponent: (appId, id) => set((state) => ({
    apps: updateApp(state.apps, appId, (draft) => ({
      ...draft,
      components: draft.components.filter((item) => item.id !== id),
    })),
  })),
  reorderComponents: (appId, fromId, toId) => set((state) => ({
    apps: updateApp(state.apps, appId, (draft) => {
      const from = draft.components.findIndex((item) => item.id === fromId);
      const to = draft.components.findIndex((item) => item.id === toId);
      if (from < 0 || to < 0 || from === to) return draft;
      const components = [...draft.components];
      const [moved] = components.splice(from, 1);
      components.splice(to, 0, moved);
      return { ...draft, components };
    }),
  })),
}));
