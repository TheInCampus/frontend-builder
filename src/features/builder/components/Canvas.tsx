"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { CSSProperties } from "react";
import type { BuilderComponent } from "@/features/builder/types";
import { useLocale } from "@/i18n/LocaleProvider";

function ComponentPreview({ component }: { component: BuilderComponent }) {
  switch (component.type) {
    case "heading": return <h2>{component.text}</h2>;
    case "text": return <p>{component.text}</p>;
    case "button": return <span className="canvas-button">{component.text}</span>;
    case "card": return <div className="canvas-card">{component.text}</div>;
  }
}

export function Canvas({
  components,
  selectedId,
  onSelect,
}: {
  components: BuilderComponent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { t } = useLocale();
  const { setNodeRef } = useDroppable({ id: "canvas" });

  return (
    <div
      className="canvas-board"
      ref={setNodeRef}
    >
      <div className="canvas-paper">
        <div className="canvas-page-label"><span className="status-dot" /> {t("pageHome")}</div>
        {components.length === 0 ? (
          <div className="canvas-empty">
            <div className="canvas-empty-icon">＋</div>
            <h2>{t("clearCanvas")}</h2>
            <p>{t("canvasInstruction")}</p>
          </div>
        ) : (
          <div className="canvas-elements">
            <SortableContext items={components.map((component) => component.id)} strategy={verticalListSortingStrategy}>
              {components.map((component) => (
                <SortableCanvasItem
                  component={component}
                  key={component.id}
                  onSelect={onSelect}
                  selected={selectedId === component.id}
                />
              ))}
            </SortableContext>
          </div>
        )}
        <div className="canvas-page-footer"><span>{t("homePage")}</span><span>100%</span></div>
      </div>
    </div>
  );
}

function SortableCanvasItem({
  component,
  selected,
  onSelect,
}: {
  component: BuilderComponent;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id, data: { kind: "canvas-component" } });
  const style: CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div
      {...attributes}
      {...listeners}
      aria-label={`Select ${component.label}`}
      className={`canvas-element${selected ? " selected" : ""}`}
      onClick={() => onSelect(component.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onSelect(component.id);
        }
      }}
      ref={setNodeRef}
      role="button"
      style={style}
      tabIndex={0}
    >
      <span className="canvas-element-label">{component.label}</span>
      <ComponentPreview component={component} />
    </div>
  );
}
