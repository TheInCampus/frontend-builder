"use client";

import type { BuilderComponent } from "@/features/builder/types";
import { useLocale } from "@/i18n/LocaleProvider";

export function PropertyInspector({
  component,
  onUpdate,
  onDelete,
}: {
  component: BuilderComponent | null;
  onUpdate: (updates: Partial<Pick<BuilderComponent, "label" | "text">>) => void;
  onDelete: () => void;
}) {
  const { t } = useLocale();
  return (
    <aside className="builder-panel inspector-panel">
      <div className="panel-heading"><span>{t("properties")}</span><span className="inspector-sliders">☷</span></div>
      {component ? (
        <div className="inspector-content">
          <div className="inspector-component-type"><span className="palette-icon">{component.type === "heading" ? "T" : component.type === "text" ? "¶" : component.type === "button" ? "↗" : "▤"}</span><span><small>{t("component")}</small><strong>{t(`component${component.type[0].toUpperCase()}${component.type.slice(1)}` as "componentHeading" | "componentText" | "componentButton" | "componentCard")}</strong></span></div>
          <label className="property-label">{t("propertyName")}<input onChange={(event) => onUpdate({ label: event.target.value })} value={component.label} /></label>
          <label className="property-label">{t("textContent")}<textarea onChange={(event) => onUpdate({ text: event.target.value })} rows={3} value={component.text} /></label>
          <div className="property-divider" />
          <div className="property-label">{t("appearance")}</div>
          <div className="property-placeholder">{t("defaultStyle")} <span>⌄</span></div>
          <button className="delete-component" onClick={onDelete} type="button">{t("removeComponent")}</button>
        </div>
      ) : (
        <div className="inspector-empty"><div>◌</div><p>{t("selectElement")}</p></div>
      )}
      <div className="inspector-footer"><span>✳</span> {t("changesAutoSave")}</div>
    </aside>
  );
}
