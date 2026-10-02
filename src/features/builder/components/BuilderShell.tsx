"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DndContext, KeyboardSensor, PointerSensor, type DragEndEvent, useSensor, useSensors } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Canvas } from "@/features/builder/components/Canvas";
import { ComponentPalette } from "@/features/builder/components/ComponentPalette";
import { PreviewPanel } from "@/features/builder/components/PreviewPanel";
import { PropertyInspector } from "@/features/builder/components/PropertyInspector";
import { useBuilderState } from "@/features/builder/hooks/useBuilderState";
import type { BuilderComponentType } from "@/features/builder/types";
import { useLocale } from "@/i18n/LocaleProvider";

export function BuilderShell({ appId }: { appId: string }) {
  const { t } = useLocale();
  const { components, ready, addComponent, updateComponent, removeComponent, reorderComponents } = useBuilderState(appId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"canvas" | "preview">("canvas");
  const selectedComponent = useMemo(
    () => components.find((component) => component.id === selectedId) ?? null,
    [components, selectedId],
  );
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleAdd(type: BuilderComponentType) {
    addComponent(type);
    setActiveView("canvas");
  }

  function handleDelete() {
    if (selectedId) removeComponent(selectedId);
    setSelectedId(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const kind = event.active.data.current?.kind;
    const targetId = event.over?.id;
    if (kind === "palette-component" && targetId) {
      const type = event.active.data.current?.componentType;
      const overKind = event.over?.data.current?.kind;
      if (
        (targetId === "canvas" || overKind === "canvas-component") &&
        (type === "heading" || type === "text" || type === "button" || type === "card")
      ) handleAdd(type);
    } else if (kind === "canvas-component" && targetId) {
      reorderComponents(appId, String(event.active.id), String(targetId));
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
    <main className="builder-page">
      <div className="builder-topbar">
        <div className="builder-breadcrumb"><Link href="/apps">{t("myApps")}</Link><span>/</span><span>{t("untitledApp")}</span><span className="breadcrumb-page">/ {t("home")}</span></div>
        <div className="builder-actions">
          <span className="saved-status"><i /> {ready ? t("allChangesSaved") : t("loadingDraft")}</span>
          <Link className="button button-small button-secondary" href={`/preview/${appId}`}>{t("preview")} ↗</Link>
          <button className="button button-small" disabled type="button">{t("publish")}</button>
        </div>
      </div>
      <div className="builder-workspace">
        <ComponentPalette onAdd={handleAdd} />
        <section aria-label={t("pageEditor")} className="builder-center">
          <div className="canvas-toolbar">
            <div className="view-switch" role="tablist" aria-label={t("editorView")}>
              <button aria-selected={activeView === "canvas"} className={activeView === "canvas" ? "active" : ""} onClick={() => setActiveView("canvas")} role="tab" type="button">▦ {t("canvas")}</button>
              <button aria-selected={activeView === "preview"} className={activeView === "preview" ? "active" : ""} onClick={() => setActiveView("preview")} role="tab" type="button">◉ {t("preview")}</button>
            </div>
            <span className="canvas-toolbar-note">⌘ S <span>·</span> {t("autosaved")}</span>
          </div>
          {activeView === "canvas"
            ? <Canvas components={components} onSelect={setSelectedId} selectedId={selectedId} />
            : <PreviewPanel components={components} />}
        </section>
        <PropertyInspector component={selectedComponent} onDelete={handleDelete} onUpdate={(updates) => selectedId && updateComponent(selectedId, updates)} />
      </div>
    </main>
    </DndContext>
  );
}
