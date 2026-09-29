"use client";

import {
  componentDefinitions,
  createBuilderComponent,
} from "@frontend-builder/builder-core";
import type {
  BuilderComponent,
  BuilderComponentType,
} from "@frontend-builder/types";
import { useRef, useState } from "react";

export function BuilderCanvas({ appId }: { appId: string }) {
  const [components, setComponents] = useState<BuilderComponent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const fallbackId = useRef(0);
  const selected = components.find((component) => component.id === selectedId);

  function addComponent(type: BuilderComponentType) {
    const id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `component-${++fallbackId.current}`;
    const component = createBuilderComponent(type, id);
    setComponents((current) => [...current, component]);
    setSelectedId(component.id);
  }

  function updateSelectedLabel(label: string) {
    if (!selectedId) {
      return;
    }

    setComponents((current) =>
      current.map((component) =>
        component.id === selectedId ? { ...component, label } : component,
      ),
    );
  }

  function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/x-builder-component");

    if (componentDefinitions.some((definition) => definition.type === type)) {
      addComponent(type as BuilderComponentType);
    }
  }

  return (
    <div className="builder-page">
      <header className="builder-header">
        <div>
          <span className="eyebrow">{appId.toUpperCase()} / PAGES</span>
          <h1>Page builder</h1>
        </div>
        <span className="save-status">All changes are local</span>
      </header>
      <div className="builder-workspace">
        <aside className="builder-panel palette-panel">
          <div className="panel-heading">
            <h2>Components</h2>
            <span>Drag or click to add</span>
          </div>
          <div className="palette-list">
            {componentDefinitions.map((definition) => (
              <button
                className="palette-item"
                draggable
                key={definition.type}
                onClick={() => addComponent(definition.type)}
                onDragStart={(event) =>
                  event.dataTransfer.setData(
                    "application/x-builder-component",
                    definition.type,
                  )
                }
                type="button"
              >
                <span className="palette-icon">{definition.label[0]}</span>
                <span className="palette-copy">
                  <strong>{definition.label}</strong>
                  <small>{definition.description}</small>
                </span>
                <span className="add-icon" aria-hidden="true">+</span>
              </button>
            ))}
          </div>
        </aside>
        <section className="canvas-stage" aria-label="Page canvas">
          <div
            className="canvas-page"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="canvas-page-label">Untitled page</div>
            {components.length === 0 ? (
              <div className="canvas-empty">
                <span className="empty-icon">↧</span>
                <strong>Start building your page</strong>
                <span>Drag a component here or choose one from the palette.</span>
              </div>
            ) : (
              <div className="canvas-components">
                {components.map((component) => (
                  <button
                    aria-label={`Select ${component.label}`}
                    aria-pressed={selectedId === component.id}
                    className={`canvas-component ${selectedId === component.id ? "is-selected" : ""}`}
                    key={component.id}
                    onClick={() => setSelectedId(component.id)}
                    type="button"
                  >
                    {component.type === "heading" ? (
                      <span className="preview-heading">{component.label}</span>
                    ) : component.type === "text" ? (
                      <span className="preview-text">{component.label}</span>
                    ) : component.type === "input" ? (
                      <span className="preview-input">{component.label}</span>
                    ) : (
                      <span className="preview-button">{component.label}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
        <aside className="builder-panel inspector-panel">
          <div className="panel-heading">
            <h2>Properties</h2>
            <span>{selected ? "Selected component" : "Nothing selected"}</span>
          </div>
          {selected ? (
            <label className="property-field">
              <span>Label</span>
              <input
                onChange={(event) => updateSelectedLabel(event.target.value)}
                value={selected.label}
              />
            </label>
          ) : (
            <div className="inspector-empty">
              Select a component on the canvas to edit its properties.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
