"use client";

import { componentDefinitions } from "@/features/builder/components-registry";
import type { BuilderComponentType } from "@/features/builder/types";

export function ComponentPalette({ onAdd }: { onAdd: (type: BuilderComponentType) => void }) {
  return (
    <aside className="builder-panel palette-panel">
      <div className="panel-heading"><span>Components</span><span className="panel-count">04</span></div>
      <p className="panel-hint">Drag onto the canvas or click to add.</p>
      <div className="palette-list">
        {componentDefinitions.map((component) => (
          <button
            className="palette-item"
            draggable
            key={component.type}
            onClick={() => onAdd(component.type)}
            onDragStart={(event) => event.dataTransfer.setData("application/canvas-component", component.type)}
            type="button"
          >
            <span className="palette-icon">{component.icon}</span>
            <span><strong>{component.name}</strong><small>{component.description}</small></span>
            <span className="palette-add" aria-hidden="true">+</span>
          </button>
        ))}
      </div>
      <div className="palette-tip"><span>✳</span><p><strong>Start with a structure</strong><br />A clear page starts with a strong title and a simple action.</p></div>
    </aside>
  );
}
