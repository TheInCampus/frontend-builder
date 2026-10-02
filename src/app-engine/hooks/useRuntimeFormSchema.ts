"use client";

import { useMemo } from "react";
import { z } from "zod";
import type { RuntimeFormField } from "@/app-engine/types";

export function useRuntimeFormSchema(fields: RuntimeFormField[]) {
  return useMemo(() => {
    const shape: Record<string, z.ZodType> = {};
    for (const field of fields) {
      if (field.type === "email") {
        const schema = z.string().email("Enter a valid email address.");
        shape[field.id] = field.required ? schema : schema.or(z.literal(""));
      } else if (field.type === "checkbox") {
        shape[field.id] = field.required
          ? z.literal(true, { error: `${field.label} is required.` })
          : z.boolean();
      } else if (field.type === "select" && Array.isArray(field.options) && field.options.length) {
        const options = field.options.slice(0, 100);
        shape[field.id] = z.string().refine(
          (value) => (value === "" && !field.required) || options.includes(value),
          field.required ? "Choose an available option." : "Choose an available option or leave blank.",
        ).refine((value) => !field.required || value.length > 0, `${field.label} is required.`);
      } else {
        const schema = z.string().trim().min(1, `${field.label} is required.`);
        shape[field.id] = field.required ? schema : z.string().optional().or(z.literal(""));
      }
    }
    return z.object(shape);
  }, [fields]);
}
