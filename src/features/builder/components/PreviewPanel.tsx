import type { BuilderComponent } from "@/features/builder/types";
import { useLocale } from "@/i18n/LocaleProvider";

function RenderComponent({ component }: { component: BuilderComponent }) {
  switch (component.type) {
    case "heading": return <h1>{component.text}</h1>;
    case "text": return <p>{component.text}</p>;
    case "button": return <button className="button" type="button">{component.text}</button>;
    case "card": return <div className="preview-content-card">{component.text}</div>;
  }
}

export function PreviewPanel({ components }: { components: BuilderComponent[] }) {
  const { t } = useLocale();
  return (
    <div className="live-preview">
      <div className="live-preview-device">
        <div className="live-preview-content">
          {components.length
            ? components.map((component) => <RenderComponent component={component} key={component.id} />)
            : <div className="preview-empty"><span>✳</span><h2>{t("appAppearsHere")}</h2><p>{t("addToSeePreview")}</p></div>}
        </div>
      </div>
    </div>
  );
}
