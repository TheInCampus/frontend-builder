"use client";

import type { DragEvent } from "react";
import type { BuilderComponent, BuilderComponentType } from "@/features/builder/types";

function ComponentPreview({ component }: { component: BuilderComponent }) {
  switch (component.type) {
    case "heading": return <h2>{component.text}</h2>;
    case "text": return <p>{component.text}</p>;
    case "button": return <button className="canvas-button" type="button">{component.text}</button>;
    case "card": return <div className="canvas-card">{component.text}</div>;
  }
}

export function Canvas({
  components,
  selectedId,
  onSelect,
  onDropComponent,
}: {
  components: BuilderComponent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDropComponent: (type: BuilderComponentType) => void;
}) {
  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/canvas-component") as BuilderComponentType;
    if (["heading", "text", "button", "card"].includes(type)) onDropComponent(type);
  }

  return (
    <div
      className="canvas-board"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="canvas-paper">
        <div className="canvas-page-label"><span className="status-dot" /> PAGE · HOME</div>
        {components.length === 0 ? (
          <div className="canvas-empty">
            <div className="canvas-empty-icon">＋</div>
            <h2>Your canvas is clear.</h2>
            <p>Drag a component here or choose one from the palette to begin.</p>
          </div>
        ) : (
          <div className="canvas-elements">
            {components.map((component) => (
              <button
                aria-label={`Select ${component.label}`}
                className={`canvas-element${selectedId === component.id ? " selected" : ""}`}
                key={component.id}
                onClick={() => onSelect(component.id)}
                type="button"
              >
                <span className="canvas-element-label">{component.label}</span>
                <ComponentPreview component={component} />
              </button>
            ))}
          </div>
        )}
        <div className="canvas-page-footer"><span>HOME</span><span>100%</span></div>
      </div>
    </div>
  );
}
