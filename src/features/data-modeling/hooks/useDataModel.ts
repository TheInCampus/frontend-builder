"use client";

import { useEffect, useState } from "react";
import { loadDataModel, saveDataModel } from "@/features/data-modeling/serialization/storage";
import type { DataField, DataFieldType, DataModel, DataObject } from "@/features/data-modeling/types";

const emptyModel: DataModel = { version: 1, objects: [] };

export function useDataModel(appId: string) {
  const [model, setModel] = useState<DataModel>(emptyModel);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    setReady(false);
    setModel(loadDataModel(appId) ?? emptyModel);
    setReady(true);
  }, [appId]);

  useEffect(() => {
    if (ready) setSaved(saveDataModel(appId, model));
  }, [appId, model, ready]);

  function addObject(name: string): DataObject | null {
    const trimmedName = name.trim();
    if (!trimmedName || model.objects.some((object) => object.name.toLowerCase() === trimmedName.toLowerCase())) {
      return null;
    }
    const object = { id: crypto.randomUUID(), name: trimmedName, fields: [] };
    setModel((current) => ({ ...current, objects: [...current.objects, object] }));
    return object;
  }

  function renameObject(id: string, name: string): boolean {
    const trimmedName = name.trim();
    if (!trimmedName || model.objects.some((object) =>
      object.id !== id && object.name.toLowerCase() === trimmedName.toLowerCase()
    )) return false;

    setModel((current) => ({
      ...current,
      objects: current.objects.map((object) => object.id === id ? { ...object, name: trimmedName } : object),
    }));
    return true;
  }

  function removeObject(id: string) {
    const isReferenced = model.objects.some((object) =>
      object.id !== id && object.fields.some((field) =>
        field.type === "relation" && field.relatedObjectId === id
      )
    );
    if (isReferenced) return false;
    setModel((current) => ({ ...current, objects: current.objects.filter((object) => object.id !== id) }));
    return true;
  }

  function addField(
    objectId: string,
    name: string,
    type: DataFieldType,
    required: boolean,
    relatedObjectId?: string,
    fieldId?: string,
  ): boolean {
    const trimmedName = name.trim();
    const object = model.objects.find((item) => item.id === objectId);
    const relationTargetExists = type !== "relation" ||
      model.objects.some((item) => item.id === relatedObjectId);
    if (!object || !trimmedName || !relationTargetExists || object.fields.some((field) =>
      field.id !== fieldId && field.name.toLowerCase() === trimmedName.toLowerCase()
    )) return false;

    const field: DataField = {
      id: fieldId ?? crypto.randomUUID(),
      name: trimmedName,
      type,
      required,
      ...(type === "relation" ? { relatedObjectId } : {}),
    };
    setModel((current) => ({
      ...current,
      objects: current.objects.map((item) => {
        if (item.id !== objectId) return item;
        const fields = fieldId
          ? item.fields.map((existing) => existing.id === fieldId ? field : existing)
          : [...item.fields, field];
        return { ...item, fields };
      }),
    }));
    return true;
  }

  function removeField(objectId: string, fieldId: string) {
    setModel((current) => ({
      ...current,
      objects: current.objects.map((object) => object.id === objectId
        ? { ...object, fields: object.fields.filter((field) => field.id !== fieldId) }
        : object),
    }));
  }

  return { model, ready, saved, addObject, renameObject, removeObject, addField, removeField };
}
