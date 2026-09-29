"use client";

import { useState, type FormEvent } from "react";
import { useDataModel } from "@/features/data-modeling/hooks/useDataModel";
import type { DataField, DataFieldType, DataObject } from "@/features/data-modeling/types";

const fieldTypes: { value: DataFieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "date", label: "Date" },
];

function FieldForm({
  field,
  onCancel,
  onSave,
}: {
  field: DataField | null;
  onCancel: () => void;
  onSave: (name: string, type: DataFieldType, required: boolean, fieldId?: string) => boolean;
}) {
  const [name, setName] = useState(field?.name ?? "");
  const [type, setType] = useState<DataFieldType>(field?.type ?? "text");
  const [required, setRequired] = useState(field?.required ?? false);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (onSave(name, type, required, field?.id)) {
      onCancel();
    } else {
      setError("Enter a unique field name.");
    }
  }

  return (
    <form className="data-field-form" onSubmit={submit}>
      <label className="data-form-label">
        Field name
        <input autoFocus maxLength={80} onChange={(event) => setName(event.target.value)} required value={name} />
      </label>
      <label className="data-form-label">
        Type
        <select onChange={(event) => setType(event.target.value as DataFieldType)} value={type}>
          {fieldTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </label>
      <label className="data-required-toggle">
        <input checked={required} onChange={(event) => setRequired(event.target.checked)} type="checkbox" />
        Required field
      </label>
      {error && <p className="data-form-error" role="alert">{error}</p>}
      <div className="data-form-actions">
        <button className="button button-small button-secondary" onClick={onCancel} type="button">Cancel</button>
        <button className="button button-small" type="submit">{field ? "Save field" : "Add field"}</button>
      </div>
    </form>
  );
}

export function DataModelingWorkspace({ appId }: { appId: string }) {
  const { model, ready, saved, addObject, renameObject, removeObject, addField, removeField } = useDataModel(appId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newObjectName, setNewObjectName] = useState("");
  const [objectError, setObjectError] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [nameError, setNameError] = useState("");
  const [editingField, setEditingField] = useState<DataField | null>(null);
  const [addingField, setAddingField] = useState(false);

  const selectedObject = model.objects.find((object) => object.id === selectedId) ?? model.objects[0] ?? null;

  function createObject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const object = addObject(newObjectName);
    if (!object) {
      setObjectError("Use a unique name for this object.");
      return;
    }
    setSelectedId(object.id);
    setNameDraft(object.name);
    setNewObjectName("");
    setObjectError("");
  }

  function selectObject(object: DataObject) {
    setSelectedId(object.id);
    setNameDraft(object.name);
    setNameError("");
    setEditingField(null);
    setAddingField(false);
  }

  function saveObjectName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedObject || !renameObject(selectedObject.id, nameDraft)) {
      setNameError("Enter a unique object name.");
      return;
    }
    setNameError("");
  }

  function deleteObject() {
    if (!selectedObject || !window.confirm(`Delete ${selectedObject.name} and all its fields?`)) return;
    const remaining = model.objects.filter((object) => object.id !== selectedObject.id);
    removeObject(selectedObject.id);
    setSelectedId(remaining[0]?.id ?? null);
    setNameDraft(remaining[0]?.name ?? "");
    setAddingField(false);
    setEditingField(null);
  }

  function saveField(name: string, type: DataFieldType, required: boolean, fieldId?: string) {
    if (!selectedObject) return false;
    const success = addField(selectedObject.id, name, type, required, fieldId);
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
          <div className="eyebrow">APP DATA</div>
          <h1>Data model</h1>
          <p>Define the objects and fields that shape your app’s data.</p>
        </div>
        <span className="data-save-status" aria-live="polite">
          {!ready ? "Loading schema…" : saved ? "Saved in this browser" : "Could not save changes"}
        </span>
      </header>

      <div className="data-model-workspace">
        <aside className="data-objects-panel" aria-label="Data objects">
          <div className="data-section-heading">
            <div><span className="eyebrow">SCHEMA</span><h2>Objects <span>{model.objects.length}</span></h2></div>
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
                  <span className="data-object-name">{object.name}<small>{object.fields.length} {object.fields.length === 1 ? "field" : "fields"}</small></span>
                  <span aria-hidden="true">›</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="data-empty-objects">Your objects will appear here.</p>
          )}
          <form className="data-object-form" onSubmit={createObject}>
            <label className="data-form-label" htmlFor="new-object-name">Create an object</label>
            <div className="data-object-input-row">
              <input
                id="new-object-name"
                maxLength={80}
                onChange={(event) => setNewObjectName(event.target.value)}
                placeholder="e.g. Customer"
                required
                value={newObjectName}
              />
              <button aria-label="Add object" className="data-add-button" type="submit">+</button>
            </div>
            {objectError && <p className="data-form-error" role="alert">{objectError}</p>}
          </form>
          <p className="data-local-note">Schema drafts are saved in this browser until a backend schema API is connected.</p>
        </aside>

        <section className="data-fields-panel" aria-label="Object fields">
          {selectedObject ? (
            <>
              <div className="data-object-heading">
                <div>
                  <div className="eyebrow">OBJECT</div>
                  <form className="data-object-rename" onSubmit={saveObjectName}>
                    <input
                      aria-label="Object name"
                      maxLength={80}
                      onChange={(event) => setNameDraft(event.target.value)}
                      required
                      value={nameDraft}
                    />
                    <button className="button button-small button-secondary" type="submit">Rename</button>
                  </form>
                  {nameError && <p className="data-form-error" role="alert">{nameError}</p>}
                </div>
                <button className="data-delete-object" onClick={deleteObject} type="button">Delete object</button>
              </div>

              <div className="data-fields-heading">
                <div><h2>Fields</h2><p>Describe the information stored on each record.</p></div>
                {!addingField && !editingField && (
                  <button className="button button-small" onClick={() => setAddingField(true)} type="button">+ Add field</button>
                )}
              </div>

              {addingField && <FieldForm onCancel={() => setAddingField(false)} onSave={saveField} field={null} />}
              {editingField && <FieldForm onCancel={() => setEditingField(null)} onSave={saveField} field={editingField} />}

              {selectedObject.fields.length > 0 ? (
                <div className="data-table-wrap">
                  <table className="data-fields-table">
                    <thead><tr><th scope="col">Field name</th><th scope="col">Type</th><th scope="col">Constraint</th><th scope="col"><span className="visually-hidden">Actions</span></th></tr></thead>
                    <tbody>
                      {selectedObject.fields.map((field) => (
                        <tr key={field.id}>
                          <td><strong>{field.name}</strong></td>
                          <td><span className="data-type-badge">{fieldTypes.find((item) => item.value === field.type)?.label}</span></td>
                          <td>{field.required ? <span className="data-required-badge">Required</span> : <span className="data-optional-badge">Optional</span>}</td>
                          <td className="data-row-actions">
                            <button aria-label={`Edit ${field.name}`} onClick={() => { setAddingField(false); setEditingField(field); }} type="button">Edit</button>
                            <button aria-label={`Delete ${field.name}`} onClick={() => removeField(selectedObject.id, field.id)} type="button">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : !addingField && !editingField ? (
                <div className="data-empty-fields">
                  <span aria-hidden="true">＋</span>
                  <h3>No fields yet</h3>
                  <p>Add fields to describe the data in a {selectedObject.name} record.</p>
                  <button className="button button-small button-secondary" onClick={() => setAddingField(true)} type="button">Add your first field</button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="data-empty-schema">
              <span aria-hidden="true">▤</span>
              <h2>Start with your first object</h2>
              <p>Objects represent the things your app stores, such as customers, orders, or products.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
