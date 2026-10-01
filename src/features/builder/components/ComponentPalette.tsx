"use client";

import { componentDefinitions } from "@/features/builder/components-registry";
import type { BuilderComponentType } from "@/features/builder/types";
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
          <button
            className="palette-item"
            draggable
            key={component.type}
            onClick={() => onAdd(component.type)}
            onDragStart={(event) => event.dataTransfer.setData("application/canvas-component", component.type)}
            type="button"
          >
            <span className="palette-icon">{component.icon}</span>
            <span><strong>{componentCopy[component.type][0]}</strong><small>{componentCopy[component.type][1]}</small></span>
            <span className="palette-add" aria-hidden="true">+</span>
          </button>
        ))}
      </div>
      <div className="palette-tip"><span>✳</span><p><strong>{t("paletteTipTitle")}</strong><br />{t("paletteTip")}</p></div>
    </aside>
  );
}
