export type BuilderComponentType = "heading" | "text" | "button" | "card";

export type BuilderComponent = {
  id: string;
  type: BuilderComponentType;
  label: string;
  text: string;
};

export type BuilderPage = {
  components: BuilderComponent[];
};
