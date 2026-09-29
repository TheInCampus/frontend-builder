"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Canvas } from "@/features/builder/components/Canvas";
import { ComponentPalette } from "@/features/builder/components/ComponentPalette";
import { PreviewPanel } from "@/features/builder/components/PreviewPanel";
import { PropertyInspector } from "@/features/builder/components/PropertyInspector";
import { useBuilderState } from "@/features/builder/hooks/useBuilderState";
import type { BuilderComponentType } from "@/features/builder/types";

export function BuilderShell({ appId }: { appId: string }) {
  const { components, ready, addComponent, updateComponent, removeComponent } = useBuilderState(appId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"canvas" | "preview">("canvas");
  const selectedComponent = useMemo(
    () => components.find((component) => component.id === selectedId) ?? null,
    [components, selectedId],
  );

  function handleAdd(type: BuilderComponentType) {
    addComponent(type);
    setActiveView("canvas");
  }

  function handleDelete() {
    if (selectedId) removeComponent(selectedId);
    setSelectedId(null);
  }

  return (
    <main className="builder-page">
      <div className="builder-topbar">
        <div className="builder-breadcrumb"><Link href="/apps">My apps</Link><span>/</span><span>Untitled app</span><span className="breadcrumb-page">/ Home</span></div>
        <div className="builder-actions">
          <span className="saved-status"><i /> {ready ? "All changes saved" : "Loading draft…"}</span>
          <Link className="button button-small button-secondary" href={`/preview/${appId}`}>Preview ↗</Link>
          <button className="button button-small" disabled type="button">Publish</button>
        </div>
      </div>
      <div className="builder-workspace">
        <ComponentPalette onAdd={handleAdd} />
        <section aria-label="Page editor" className="builder-center">
          <div className="canvas-toolbar">
            <div className="view-switch" role="tablist" aria-label="Editor view">
              <button aria-selected={activeView === "canvas"} className={activeView === "canvas" ? "active" : ""} onClick={() => setActiveView("canvas")} role="tab" type="button">▦ Canvas</button>
              <button aria-selected={activeView === "preview"} className={activeView === "preview" ? "active" : ""} onClick={() => setActiveView("preview")} role="tab" type="button">◉ Preview</button>
            </div>
            <span className="canvas-toolbar-note">⌘ S <span>·</span> Autosaved</span>
          </div>
          {activeView === "canvas"
            ? <Canvas components={components} onDropComponent={handleAdd} onSelect={setSelectedId} selectedId={selectedId} />
            : <PreviewPanel components={components} />}
        </section>
        <PropertyInspector component={selectedComponent} onDelete={handleDelete} onUpdate={(updates) => selectedId && updateComponent(selectedId, updates)} />
      </div>
    </main>
  );
}
