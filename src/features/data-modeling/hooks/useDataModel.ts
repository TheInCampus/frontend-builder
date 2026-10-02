"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import { isDataModel, loadDataModel, saveDataModel } from "@/features/data-modeling/serialization/storage";
import type { DataField, DataFieldType, DataModel, DataObject } from "@/features/data-modeling/types";

const emptyModel: DataModel = { version: 1, objects: [] };

export function useDataModel(appId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["basemodel", appId];
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const [saved, setSaved] = useState(true);
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const localModel = loadDataModel(appId);
      try {
        const result = await apiRequest<{ model: unknown }>(`metaplatform/apps/${encodeURIComponent(appId)}/basemodel`);
        if (!isDataModel(result.model)) throw new Error("Invalid model returned by the API.");
        if (result.model.objects.length === 0 && localModel?.objects.length) return localModel;
        return result.model;
      } catch {
        return localModel ?? emptyModel;
      }
    },
  });
  const persistModel = useMutation({
    mutationFn: (model: DataModel) => apiRequest<{ model: DataModel }>(
      `metaplatform/apps/${encodeURIComponent(appId)}/basemodel`,
      { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model }) },
    ),
  });
  const saveModelToApi = persistModel.mutateAsync;
  const model = query.data ?? emptyModel;
  const ready = query.isSuccess;

  useEffect(() => {
    if (!ready) return;
    const localSaved = saveDataModel(appId, model);
    setSaved(localSaved);
    if (!localSaved) return;
    const timeout = window.setTimeout(() => {
      saveQueue.current = saveQueue.current.catch(() => undefined).then(async () => {
        try {
          await saveModelToApi(model);
        } catch {
          // The browser draft remains available when the development API is offline or unauthenticated.
        }
      });
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [appId, model, ready, saveModelToApi]);

  function updateModel(update: (current: DataModel) => DataModel) {
    queryClient.setQueryData<DataModel>(queryKey, (current) => update(current ?? emptyModel));
  }

  function addObject(name: string): DataObject | null {
    const trimmedName = name.trim();
    if (!trimmedName || model.objects.some((object) => object.name.toLowerCase() === trimmedName.toLowerCase())) {
      return null;
    }
    const object = { id: crypto.randomUUID(), name: trimmedName, fields: [] };
    updateModel((current) => ({ ...current, objects: [...current.objects, object] }));
    return object;
  }

  function renameObject(id: string, name: string): boolean {
    const trimmedName = name.trim();
    if (!trimmedName || model.objects.some((object) =>
      object.id !== id && object.name.toLowerCase() === trimmedName.toLowerCase()
    )) return false;

    updateModel((current) => ({
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
    updateModel((current) => ({ ...current, objects: current.objects.filter((object) => object.id !== id) }));
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
    updateModel((current) => ({
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
    updateModel((current) => ({
      ...current,
      objects: current.objects.map((object) => object.id === objectId
        ? { ...object, fields: object.fields.filter((field) => field.id !== fieldId) }
        : object),
    }));
  }

  return { model, ready, saved, addObject, renameObject, removeObject, addField, removeField };
}
