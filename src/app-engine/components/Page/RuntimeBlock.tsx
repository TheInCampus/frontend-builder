import type { RuntimeBlock as RuntimeBlockConfig } from "@/app-engine/types";
import { RuntimeForm } from "@/app-engine/components/Forms/RuntimeForm";
import { RuntimeRecordTable } from "@/app-engine/components/Services/RuntimeRecordTable";

function safeHref(href: string) {
  return href.startsWith("#") || (href.startsWith("/") && !href.startsWith("//")) ? href : "#";
}

export function RuntimeBlock({ block }: { block: RuntimeBlockConfig }) {
  switch (block.type) {
    case "heading": {
      const Heading = `h${block.level ?? 2}` as "h1" | "h2" | "h3";
      return <header className="runtime-copy-block">{block.eyebrow && <span className="runtime-eyebrow">{block.eyebrow}</span>}<Heading>{block.text}</Heading></header>;
    }
    case "paragraph":
      return <p className="runtime-paragraph">{block.text}</p>;
    case "button":
      return <a className="button runtime-cta" href={safeHref(block.href)}>{block.text}<span aria-hidden="true">↗</span></a>;
    case "cards":
      return <div className="runtime-card-grid">{block.items.map((item) => <article className="runtime-feature-card" key={item.title}><span aria-hidden="true">{item.icon ?? "✳"}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>;
    case "records":
      return <RuntimeRecordTable title={block.title} records={block.records} />;
    case "form":
      return <RuntimeForm fields={block.fields} submitLabel={block.submitLabel} title={block.title} />;
  }
}
