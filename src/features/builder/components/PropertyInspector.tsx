"use client";

import type { BuilderComponent } from "@/features/builder/types";

export function PropertyInspector({
  component,
  onUpdate,
  onDelete,
}: {
  component: BuilderComponent | null;
  onUpdate: (updates: Partial<Pick<BuilderComponent, "label" | "text">>) => void;
  onDelete: () => void;
}) {
  return (
    <aside className="builder-panel inspector-panel">
      <div className="panel-heading"><span>Properties</span><span className="inspector-sliders">☷</span></div>
      {component ? (
        <div className="inspector-content">
          <div className="inspector-component-type"><span className="palette-icon">{component.type === "heading" ? "T" : component.type === "text" ? "¶" : component.type === "button" ? "↗" : "▤"}</span><span><small>COMPONENT</small><strong>{component.type[0].toUpperCase() + component.type.slice(1)}</strong></span></div>
          <label className="property-label">Name<input onChange={(event) => onUpdate({ label: event.target.value })} value={component.label} /></label>
          <label className="property-label">Text content<textarea onChange={(event) => onUpdate({ text: event.target.value })} rows={3} value={component.text} /></label>
          <div className="property-divider" />
          <div className="property-label">Appearance</div>
          <div className="property-placeholder">Default style <span>⌄</span></div>
          <button className="delete-component" onClick={onDelete} type="button">Remove component</button>
        </div>
      ) : (
        <div className="inspector-empty"><div>◌</div><p>Select an element on the canvas to edit its properties.</p></div>
      )}
      <div className="inspector-footer"><span>✳</span> Changes save automatically</div>
    </aside>
  );
}
