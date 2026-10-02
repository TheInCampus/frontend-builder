import type { RuntimeApplicationConfig, RuntimePageConfig } from "@/app-engine/types";
import { RuntimeBlock } from "@/app-engine/components/Page/RuntimeBlock";
import { StructuredData } from "@/app-engine/components/SEO/StructuredData";

function safeHref(href: string) {
  return href.startsWith("#") || (href.startsWith("/") && !href.startsWith("//")) ? href : "#";
}

export function RuntimePage({
  application,
  page,
}: {
  application: RuntimeApplicationConfig;
  page: RuntimePageConfig;
}) {
  return (
    <main className="runtime-shell">
      {application.metadata.structuredData && <StructuredData data={application.metadata.structuredData} />}
      <header className="runtime-topbar">
        <a className="runtime-brand" href="/engine-demo"><span className="runtime-brand-mark">N</span>{application.name}</a>
        <nav aria-label="Application navigation">
          {application.navigation.map((item) => <a href={safeHref(item.href)} key={item.href}>{item.label}</a>)}
        </nav>
        <a className="runtime-topbar-cta" href="#contact">Let’s talk <span aria-hidden="true">↗</span></a>
      </header>
      <article className="runtime-page">
        <div className="runtime-content">
          {page.blocks.map((block) => <RuntimeBlock block={block} key={block.id} />)}
        </div>
      </article>
      <footer className="runtime-footer"><span>{application.name}</span><span>Sample interpreted application · schema v{application.version}</span></footer>
    </main>
  );
}
