import { z } from "zod";

const formField = z.object({
  id: z.string().regex(/^[A-Za-z][A-Za-z0-9_-]{0,63}$/),
  label: z.string().min(1).max(120),
  type: z.enum(["text", "email", "tel", "select", "checkbox"]),
  required: z.boolean().optional(),
  options: z.array(z.string().min(1).max(100)).max(100).optional(),
}).strict().superRefine((field, context) => {
  if (field.type === "select" && !field.options?.length) {
    context.addIssue({ code: "custom", path: ["options"], message: "Select fields require at least one option." });
  }
});

const block = z.discriminatedUnion("type", [
  z.object({ id: z.string().min(1).max(100), type: z.literal("heading"), eyebrow: z.string().max(100).optional(), text: z.string().max(500), level: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional() }).strict(),
  z.object({ id: z.string().min(1).max(100), type: z.literal("paragraph"), text: z.string().max(2000) }).strict(),
  z.object({ id: z.string().min(1).max(100), type: z.literal("button"), text: z.string().max(120), href: z.string().regex(/^(#[A-Za-z][\w-]*|\/(?!\/)[^\\\s]*)$/) }).strict(),
  z.object({ id: z.string().min(1).max(100), type: z.literal("cards"), items: z.array(z.object({ title: z.string().min(1).max(120), description: z.string().max(500), icon: z.string().max(8).optional() }).strict()).max(12) }).strict(),
  z.object({ id: z.string().min(1).max(100), type: z.literal("records"), title: z.string().max(120), records: z.array(z.record(z.string(), z.string().max(500))).max(100) }).strict(),
  z.object({ id: z.string().min(1).max(100), type: z.literal("form"), title: z.string().max(160), submitLabel: z.string().max(80), fields: z.array(formField).max(50) }).strict().superRefine((form, context) => {
    const ids = new Set<string>();
    for (const [index, field] of form.fields.entries()) {
      if (ids.has(field.id)) context.addIssue({ code: "custom", path: ["fields", index, "id"], message: "Form field IDs must be unique." });
      ids.add(field.id);
    }
  }),
]);

const runtimeApplication = z.object({
  version: z.literal(1),
  id: z.string().min(1).max(100),
  name: z.string().min(1).max(120),
  locale: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/),
  navigation: z.array(z.object({
    label: z.string().min(1).max(80),
    href: z.string().regex(/^(#[A-Za-z][\w-]*|\/(?!\/)[^\\\s]*)$/),
  }).strict()).max(20),
  metadata: z.object({
    title: z.string().max(160),
    description: z.string().max(320),
    canonicalUrl: z.string().url().max(2048).optional(),
    structuredData: z.record(z.string(), z.unknown()).optional(),
  }).strict(),
  pages: z.array(z.object({
    id: z.string().min(1).max(100),
    title: z.string().max(120),
    path: z.string().regex(/^\/(?:[a-zA-Z0-9/_-]*)$/),
    blocks: z.array(block).max(100),
  }).strict()).max(100),
}).strict().superRefine((application, context) => {
  const pageIds = new Set<string>();
  const pagePaths = new Set<string>();
  for (const [index, page] of application.pages.entries()) {
    if (pageIds.has(page.id)) context.addIssue({ code: "custom", path: ["pages", index, "id"], message: "Page IDs must be unique." });
    if (pagePaths.has(page.path)) context.addIssue({ code: "custom", path: ["pages", index, "path"], message: "Page paths must be unique." });
    pageIds.add(page.id);
    pagePaths.add(page.path);
  }
});

export function parseRuntimeApplication(value: unknown) {
  return runtimeApplication.parse(value);
}
