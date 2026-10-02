export type DataFieldType = "text" | "number" | "boolean" | "date" | "relation";

export type DataField = {
  id: string;
  name: string;
  type: DataFieldType;
  required: boolean;
  relatedObjectId?: string;
};

export type DataObject = {
  id: string;
  name: string;
  fields: DataField[];
};

export type DataModel = {
  version: 1;
  objects: DataObject[];
};
