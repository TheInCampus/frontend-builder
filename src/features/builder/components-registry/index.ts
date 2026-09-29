import type { BuilderComponentType } from "@/features/builder/types";

export const componentDefinitions: {
  type: BuilderComponentType;
  name: string;
  description: string;
  icon: string;
  defaultLabel: string;
  defaultText: string;
}[] = [
  { type: "heading", name: "Heading", description: "Page title", icon: "T", defaultLabel: "Heading", defaultText: "A fresh start" },
  { type: "text", name: "Text", description: "Supporting copy", icon: "¶", defaultLabel: "Text", defaultText: "Add a little more context here." },
  { type: "button", name: "Button", description: "Primary action", icon: "↗", defaultLabel: "Button", defaultText: "Get started" },
  { type: "card", name: "Card", description: "Content block", icon: "▤", defaultLabel: "Card", defaultText: "A place for something important." },
];
