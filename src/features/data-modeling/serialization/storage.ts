import type { DataFieldType, DataModel } from "@/features/data-modeling/types";

function storageKey(appId: string) {
  return `canvas-data-model:${encodeURIComponent(appId)}`;
}

function isDataFieldType(value: unknown): value is DataFieldType {
  return value === "text" || value === "number" || value === "boolean" || value === "date";
}

function isDataModel(value: unknown): value is DataModel {
  if (typeof value !== "object" || value === null || !("version" in value) || !("objects" in value)) {
    return false;
  }

  const model = value as DataModel;
  return model.version === 1 &&
    Array.isArray(model.objects) &&
    model.objects.every((object) =>
      typeof object.id === "string" &&
      typeof object.name === "string" &&
      Array.isArray(object.fields) &&
      object.fields.every((field) =>
        typeof field.id === "string" &&
        typeof field.name === "string" &&
        isDataFieldType(field.type) &&
        typeof field.required === "boolean"
      )
    );
}

export function loadDataModel(appId: string): DataModel | null {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(storageKey(appId)) ?? "null");
    return isDataModel(value) ? value : null;
  } catch {
    return null;
  }
}

export function saveDataModel(appId: string, model: DataModel): boolean {
  try {
    window.localStorage.setItem(storageKey(appId), JSON.stringify(model));
    return true;
  } catch {
    return false;
  }
}
