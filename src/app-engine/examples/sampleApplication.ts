import type { RuntimeApplicationConfig } from "@/app-engine/types";

export const sampleApplication: RuntimeApplicationConfig = {
  version: 1,
  id: "northstar-studio",
  name: "Northstar",
  locale: "en",
  navigation: [
    { label: "Overview", href: "#overview" },
    { label: "Work", href: "#work" },
    { label: "Contact", href: "#contact" },
  ],
  metadata: {
    title: "Northstar — independent design studio",
    description: "A sample published application rendered from a typed runtime configuration.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Northstar Studio",
      description: "Independent digital design studio",
    },
  },
  pages: [{
    id: "home",
    title: "Home",
    path: "/",
    blocks: [
      { id: "hero", type: "heading", eyebrow: "INDEPENDENT DIGITAL STUDIO · EST. 2018", text: "Make room for what’s next.", level: 1 },
      { id: "intro", type: "paragraph", text: "We help ambitious teams turn complex ideas into clear, useful digital products. Small senior team, thoughtful by design." },
      { id: "hero-action", type: "button", text: "Explore our approach", href: "#work" },
      {
        id: "services",
        type: "cards",
        items: [
          { title: "Product direction", description: "Find the simplest path from a promising idea to a product people love.", icon: "↗" },
          { title: "Digital experiences", description: "Build accessible, coherent interfaces that feel effortless to use.", icon: "◫" },
          { title: "Design systems", description: "Give teams a shared visual language that grows with their product.", icon: "✳" },
        ],
      },
      {
        id: "work",
        type: "records",
        title: "A few recent collaborations",
        records: [
          { Project: "Fieldnotes", Focus: "Product strategy", Year: "2025" },
          { Project: "Common Ground", Focus: "Digital experience", Year: "2024" },
          { Project: "Northstar Studio", Focus: "Design system", Year: "2024" },
        ],
      },
      {
        id: "contact",
        type: "form",
        title: "Tell us what you’re imagining.",
        submitLabel: "Send inquiry",
        fields: [
          { id: "name", label: "Your name", type: "text", required: true },
          { id: "email", label: "Work email", type: "email", required: true },
          { id: "project", label: "What are you working on?", type: "select", required: true, options: ["A new product", "A redesign", "A design system"] },
          { id: "updates", label: "Send me occasional studio notes", type: "checkbox" },
        ],
      },
    ],
  }],
};
