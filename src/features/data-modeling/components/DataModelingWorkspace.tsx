"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useDataModel } from "@/features/data-modeling/hooks/useDataModel";
import type { DataField, DataFieldType, DataObject } from "@/features/data-modeling/types";
import { useLocale } from "@/i18n/LocaleProvider";
import type { MessageKey } from "@/i18n/messages";

const fieldTypes: { value: DataFieldType; labelKey: MessageKey }[] = [
  { value: "text", labelKey: "textType" },
  { value: "number", labelKey: "numberType" },
  { value: "boolean", labelKey: "booleanType" },
  { value: "date", labelKey: "dateType" },
  { value: "relation", labelKey: "relationType" },
];

function FieldForm({
  field,
  objects,
  onCancel,
  onSave,
}: {
  field: DataField | null;
  objects: DataObject[];
  onCancel: () => void;
  onSave: (name: string, type: DataFieldType, required: boolean, relatedObjectId?: string, fieldId?: string) => boolean;
}) {
  const { t } = useLocale();
  const [name, setName] = useState(field?.name ?? "");
  const [type, setType] = useState<DataFieldType>(field?.type ?? "text");
  const [required, setRequired] = useState(field?.required ?? false);
  const [relatedObjectId, setRelatedObjectId] = useState(field?.relatedObjectId ?? objects[0]?.id ?? "");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (onSave(name, type, required, type === "relation" ? relatedObjectId : undefined, field?.id)) {
      onCancel();
    } else {
      setError(t("uniqueFieldName"));
    }
  }

  return (
    <form className="data-field-form" onSubmit={submit}>
      <label className="data-form-label">
        {t("fieldName")}
        <input autoFocus maxLength={80} onChange={(event) => setName(event.target.value)} required value={name} />
      </label>
      <label className="data-form-label">
        {t("type")}
        <select onChange={(event) => setType(event.target.value as DataFieldType)} value={type}>
          {fieldTypes.map((item) => <option key={item.value} value={item.value}>{t(item.labelKey)}</option>)}
        </select>
      </label>
      {type === "relation" && (
        <label className="data-form-label">
          {t("relatedObject")}
          <select onChange={(event) => setRelatedObjectId(event.target.value)} required value={relatedObjectId}>
            {objects.map((object) => <option key={object.id} value={object.id}>{object.name}</option>)}
          </select>
        </label>
      )}
      <label className="data-required-toggle">
        <input checked={required} onChange={(event) => setRequired(event.target.checked)} type="checkbox" />
        {t("requiredField")}
      </label>
      {error && <p className="data-form-error" role="alert">{error}</p>}
      <div className="data-form-actions">
        <button className="button button-small button-secondary" onClick={onCancel} type="button">{t("cancel")}</button>
        <button className="button button-small" type="submit">{field ? t("saveField") : t("addFieldSubmit")}</button>
      </div>
    </form>
  );
}

export function DataModelingWorkspace({ appId }: { appId: string }) {
  const { t } = useLocale();
  const { model, ready, saved, addObject, renameObject, removeObject, addField, removeField } = useDataModel(appId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newObjectName, setNewObjectName] = useState("");
  const [objectError, setObjectError] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [nameError, setNameError] = useState("");
  const [objectDeleteError, setObjectDeleteError] = useState("");
  const [editingField, setEditingField] = useState<DataField | null>(null);
  const [addingField, setAddingField] = useState(false);

  const selectedObject = model.objects.find((object) => object.id === selectedId) ?? model.objects[0] ?? null;
  const selectedObjectName = selectedObject?.name;

  useEffect(() => {
    if (selectedObjectName !== undefined) setNameDraft(selectedObjectName);
  }, [selectedObjectName]);

  function createObject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const object = addObject(newObjectName);
    if (!object) {
      setObjectError(t("uniqueObjectName"));
      return;
    }
    setSelectedId(object.id);
    setNameDraft(object.name);
    setNewObjectName("");
    setObjectError("");
    setObjectDeleteError("");
  }

  function selectObject(object: DataObject) {
    setSelectedId(object.id);
    setNameDraft(object.name);
    setNameError("");
    setObjectDeleteError("");
    setEditingField(null);
    setAddingField(false);
  }

  function saveObjectName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedObject || !renameObject(selectedObject.id, nameDraft)) {
      setNameError(t("uniqueObjectName"));
      return;
    }
    setNameError("");
  }

  function deleteObject() {
    if (!selectedObject || !window.confirm(`${t("deleteObjectConfirm")} (${selectedObject.name})`)) return;
    const remaining = model.objects.filter((object) => object.id !== selectedObject.id);
    if (!removeObject(selectedObject.id)) {
      setObjectDeleteError(t("relationDeleteError"));
      return;
    }
    setSelectedId(remaining[0]?.id ?? null);
    setNameDraft(remaining[0]?.name ?? "");
    setObjectDeleteError("");
    setAddingField(false);
    setEditingField(null);
  }

  function saveField(
    name: string,
    type: DataFieldType,
    required: boolean,
    relatedObjectId?: string,
    fieldId?: string,
  ) {
    if (!selectedObject) return false;
    const success = addField(selectedObject.id, name, type, required, relatedObjectId, fieldId);
    if (success) {
      setAddingField(false);
      setEditingField(null);
    }
    return success;
  }

  return (
    <main className="data-model-page">
      <header className="data-model-header">
        <div>
          <div className="eyebrow">{t("appData")}</div>
          <h1>{t("dataModel")}</h1>
          <p>{t("defineObjects")}</p>
        </div>
        <span className="data-save-status" aria-live="polite">
          {!ready ? t("loadingSchema") : saved ? t("savedInBrowser") : t("saveFailed")}
        </span>
      </header>

      <div className="data-model-workspace">
        <aside className="data-objects-panel" aria-label={t("objects")}>
          <div className="data-section-heading">
          <div><span className="eyebrow">{t("schema")}</span><h2>{t("objects")} <span>{model.objects.length}</span></h2></div>
          </div>
          {model.objects.length > 0 ? (
            <div className="data-object-list">
              {model.objects.map((object) => (
                <button
                  aria-current={selectedObject?.id === object.id ? "page" : undefined}
                  className={`data-object-item${selectedObject?.id === object.id ? " active" : ""}`}
                  key={object.id}
                  onClick={() => selectObject(object)}
                  type="button"
                >
                  <span className="data-object-icon">▤</span>
                  <span className="data-object-name">{object.name}<small>{object.fields.length} {object.fields.length === 1 ? t("field") : t("fieldsPlural")}</small></span>
                  <span aria-hidden="true">›</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="data-empty-objects">{t("emptyObjects")}</p>
          )}
          <form className="data-object-form" onSubmit={createObject}>
            <label className="data-form-label" htmlFor="new-object-name">{t("createObject")}</label>
            <div className="data-object-input-row">
              <input
                id="new-object-name"
                maxLength={80}
                onChange={(event) => setNewObjectName(event.target.value)}
                placeholder={t("exampleCustomer")}
                required
                value={newObjectName}
              />
              <button aria-label={t("addObject")} className="data-add-button" type="submit">+</button>
            </div>
            {objectError && <p className="data-form-error" role="alert">{objectError}</p>}
          </form>
          <p className="data-local-note">{t("schemaLocalNote")}</p>
        </aside>

        <section className="data-fields-panel" aria-label={t("fields")}>
          {selectedObject ? (
            <>
              <div className="data-object-heading">
                <div>
                  <div className="eyebrow">{t("object")}</div>
                  <form className="data-object-rename" onSubmit={saveObjectName}>
                    <input
                      aria-label={t("object")}
                      maxLength={80}
                      onChange={(event) => setNameDraft(event.target.value)}
                      required
                      value={nameDraft}
                    />
                    <button className="button button-small button-secondary" type="submit">{t("rename")}</button>
                  </form>
                  {nameError && <p className="data-form-error" role="alert">{nameError}</p>}
                </div>
                <button className="data-delete-object" onClick={deleteObject} type="button">{t("deleteObject")}</button>
              </div>
              {objectDeleteError && <p className="data-form-error" role="alert">{objectDeleteError}</p>}

              <div className="data-fields-heading">
                <div><h2>{t("fields")}</h2><p>{t("describeFields")}</p></div>
                {!addingField && !editingField && (
                  <button className="button button-small" onClick={() => setAddingField(true)} type="button">+ {t("addField")}</button>
                )}
              </div>

              {addingField && <FieldForm onCancel={() => setAddingField(false)} onSave={saveField} field={null} objects={model.objects} />}
              {editingField && <FieldForm onCancel={() => setEditingField(null)} onSave={saveField} field={editingField} objects={model.objects} />}

              {selectedObject.fields.length > 0 ? (
                <div className="data-table-wrap">
                  <table className="data-fields-table">
                    <thead><tr><th scope="col">{t("fieldName")}</th><th scope="col">{t("type")}</th><th scope="col">{t("constraint")}</th><th scope="col"><span className="visually-hidden">{t("actions")}</span></th></tr></thead>
                    <tbody>
                      {selectedObject.fields.map((field) => (
                        <tr key={field.id}>
                          <td><strong>{field.name}</strong></td>
                          <td><span className="data-type-badge">
                            {field.type === "relation"
                              ? `→ ${model.objects.find((object) => object.id === field.relatedObjectId)?.name ?? t("missingObject")}`
                              : t(fieldTypes.find((item) => item.value === field.type)?.labelKey ?? "textType")}
                          </span></td>
                          <td>{field.required ? <span className="data-required-badge">{t("required")}</span> : <span className="data-optional-badge">{t("optional")}</span>}</td>
                          <td className="data-row-actions">
                            <button aria-label={`${t("edit")} ${field.name}`} onClick={() => { setAddingField(false); setEditingField(field); }} type="button">{t("edit")}</button>
                            <button aria-label={`${t("delete")} ${field.name}`} onClick={() => removeField(selectedObject.id, field.id)} type="button">{t("delete")}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : !addingField && !editingField ? (
                <div className="data-empty-fields">
                  <span aria-hidden="true">＋</span>
                  <h3>{t("noFields")}</h3>
                  <p>{t("addFieldsPrompt")}</p>
                  <button className="button button-small button-secondary" onClick={() => setAddingField(true)} type="button">{t("addFirstField")}</button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="data-empty-schema">
              <span aria-hidden="true">▤</span>
              <h2>{t("startWithObject")}</h2>
              <p>{t("objectDefinition")}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
