import type { BuilderComponent } from "@/features/builder/types";

function RenderComponent({ component }: { component: BuilderComponent }) {
  switch (component.type) {
    case "heading": return <h1>{component.text}</h1>;
    case "text": return <p>{component.text}</p>;
    case "button": return <button className="button" type="button">{component.text}</button>;
    case "card": return <div className="preview-content-card">{component.text}</div>;
  }
}

export function PreviewPanel({ components }: { components: BuilderComponent[] }) {
  return (
    <div className="live-preview">
      <div className="live-preview-device">
        <div className="live-preview-content">
          {components.length
            ? components.map((component) => <RenderComponent component={component} key={component.id} />)
            : <div className="preview-empty"><span>✳</span><h2>Your app will show up here.</h2><p>Add components to see them in your preview.</p></div>}
        </div>
      </div>
    </div>
  );
}
