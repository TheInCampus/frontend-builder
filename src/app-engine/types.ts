export type RuntimeFormField = {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "checkbox";
  required?: boolean;
  options?: string[];
};

export type RuntimeBlock =
  | { id: string; type: "heading"; eyebrow?: string; text: string; level?: 1 | 2 | 3 }
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "button"; text: string; href: string }
  | { id: string; type: "cards"; items: Array<{ title: string; description: string; icon?: string }> }
  | { id: string; type: "records"; title: string; records: Array<Record<string, string>> }
  | { id: string; type: "form"; title: string; submitLabel: string; fields: RuntimeFormField[] };

export type RuntimePageConfig = {
  id: string;
  title: string;
  path: string;
  blocks: RuntimeBlock[];
};

export type RuntimeApplicationConfig = {
  version: 1;
  id: string;
  name: string;
  locale: string;
  navigation: Array<{ label: string; href: string }>;
  metadata: {
    title: string;
    description: string;
    canonicalUrl?: string;
    structuredData?: Record<string, unknown>;
  };
  pages: RuntimePageConfig[];
};
