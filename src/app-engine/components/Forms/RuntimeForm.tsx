"use client";

import { useMemo, useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import type { RuntimeFormField } from "@/app-engine/types";
import { useRuntimeFormSchema } from "@/app-engine/hooks/useRuntimeFormSchema";

export function RuntimeForm({
  title,
  submitLabel,
  fields,
}: {
  title: string;
  submitLabel: string;
  fields: RuntimeFormField[];
}) {
  const safeFields = useMemo(() => {
    const seen = new Set<string>();
    return fields.flatMap((field) => {
      if (!/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(field.id) || seen.has(field.id)) return [];
      seen.add(field.id);
      if (!["text", "email", "tel", "select", "checkbox"].includes(field.type)) return [];
      return [{
        ...field,
        ...(field.type === "select"
          ? { options: (field.options ?? []).filter((option) => typeof option === "string").slice(0, 100) }
          : {}),
      }];
    });
  }, [fields]);
  const schema = useRuntimeFormSchema(safeFields);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, setError, clearErrors, formState: { errors, isSubmitting } } = useForm();

  function submit(values: FieldValues) {
    clearErrors();
    const result = schema.safeParse(values);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const fieldId = issue.path[0];
        if (typeof fieldId === "string") {
          setError(fieldId, { type: "validation", message: issue.message });
        }
      }
      return;
    }
    setSubmitted(true);
  }

  return (
    <section className="runtime-form-card">
      <span className="runtime-eyebrow">GET STARTED</span>
      <h2>{title}</h2>
      {submitted ? (
        <p aria-live="polite" className="runtime-form-success">Thanks — your information passed validation.</p>
      ) : (
        <form className="runtime-form" noValidate onSubmit={handleSubmit(submit)}>
          {safeFields.map((field) => (
            <label className={field.type === "checkbox" ? "runtime-checkbox-field" : ""} key={field.id}>
              {field.type === "checkbox" ? (
                <><input type="checkbox" {...register(field.id)} /><span>{field.label}</span></>
              ) : field.type === "select" ? (
                <>
                  <span>{field.label}</span>
                  <select defaultValue="" {...register(field.id)}>
                    <option disabled value="">Choose an option</option>
                    {(field.options ?? []).map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </>
              ) : (
                <>
                  <span>{field.label}</span>
                  <input
                    autoComplete={field.type === "email" ? "email" : field.type === "tel" ? "tel" : "off"}
                    type={field.type}
                    {...register(field.id)}
                  />
                </>
              )}
              {errors[field.id]?.message && <small className="runtime-field-error" role="alert">{String(errors[field.id]?.message)}</small>}
            </label>
          ))}
          <button className="button runtime-submit" disabled={isSubmitting} type="submit">{submitLabel}<span aria-hidden="true">→</span></button>
        </form>
      )}
    </section>
  );
}
