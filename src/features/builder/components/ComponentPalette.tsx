"use client";

import { useDraggable } from "@dnd-kit/core";
import { componentDefinitions } from "@/features/builder/components/registry";
import type { BuilderComponentType } from "@/types/json-schema";
import { useLocale } from "@/i18n/LocaleProvider";

export function ComponentPalette({ onAdd }: { onAdd: (type: BuilderComponentType) => void }) {
  const { t } = useLocale();
  const componentCopy = {
    heading: [t("componentHeading"), t("headingDescription")],
    text: [t("componentText"), t("textDescription")],
    button: [t("componentButton"), t("buttonDescription")],
    card: [t("componentCard"), t("cardDescription")],
  } as const;
  return (
    <aside className="builder-panel palette-panel">
      <div className="panel-heading"><span>{t("components")}</span><span className="panel-count">04</span></div>
      <p className="panel-hint">{t("dragOrClick")}</p>
      <div className="palette-list">
        {componentDefinitions.map((component) => (
          <PaletteItem
            component={component}
            description={componentCopy[component.type][1]}
            key={component.type}
            label={componentCopy[component.type][0]}
            onAdd={onAdd}
          />
        ))}
      </div>
      <div className="palette-tip"><span>✳</span><p><strong>{t("paletteTipTitle")}</strong><br />{t("paletteTip")}</p></div>
    </aside>
  );
}

function PaletteItem({
  component,
  label,
  description,
  onAdd,
}: {
  component: (typeof componentDefinitions)[number];
  label: string;
  description: string;
  onAdd: (type: BuilderComponentType) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette:${component.type}`,
    data: { kind: "palette-component", componentType: component.type },
  });

  return (
    <button
      {...attributes}
      {...listeners}
      className="palette-item"
      onClick={() => onAdd(component.type)}
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.5 : undefined }}
      type="button"
    >
      <span className="palette-icon">{component.icon}</span>
      <span><strong>{label}</strong><small>{description}</small></span>
      <span className="palette-add" aria-hidden="true">+</span>
    </button>
  );
}
