export type BuilderComponentType = "heading" | "text" | "button" | "input";

export interface BuilderComponent {
  id: string;
  type: BuilderComponentType;
  label: string;
}

export interface PageConfiguration {
  id: string;
  name: string;
  components: BuilderComponent[];
}
