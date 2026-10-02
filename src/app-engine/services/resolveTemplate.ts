const TOKEN_PATTERN = /\{\{\s*([a-zA-Z0-9_.-]{1,100})\s*\}\}/g;

export function resolveTemplate(
  template: string,
  values: Record<string, unknown>,
  maxLength = 500,
) {
  const resolved = template.replace(TOKEN_PATTERN, (_, key: string) => {
    const value = key.split(".").reduce<unknown>((current, part) => {
      if (typeof current !== "object" || current === null || !Object.hasOwn(current, part)) {
        return undefined;
      }
      return (current as Record<string, unknown>)[part];
    }, values);
    return typeof value === "string" || typeof value === "number" ? String(value) : "";
  });
  return resolved.slice(0, maxLength);
}
