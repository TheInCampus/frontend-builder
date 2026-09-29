import type { BuilderComponent, BuilderComponentType } from "@frontend-builder/types";

export interface ComponentDefinition {
  type: BuilderComponentType;
  label: string;
  description: string;
  defaultLabel: string;
}

export const componentDefinitions: ComponentDefinition[] = [
  {
    type: "heading",
    label: "Heading",
    description: "A page heading",
    defaultLabel: "New heading",
  },
  {
    type: "text",
    label: "Text",
    description: "A paragraph of text",
    defaultLabel: "Add your text",
  },
  {
    type: "button",
    label: "Button",
    description: "An action button",
    defaultLabel: "Button",
  },
  {
    type: "input",
    label: "Text input",
    description: "A form text field",
    defaultLabel: "Text input",
  },
];

export function createBuilderComponent(
  type: BuilderComponentType,
  id: string,
): BuilderComponent {
  const definition = componentDefinitions.find((item) => item.type === type);

  if (!definition) {
    throw new Error(`Unknown builder component: ${type}`);
  }

  return { id, type, label: definition.defaultLabel };
}
