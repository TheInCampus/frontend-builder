export function serializeStructuredData(data: Record<string, unknown>) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function StructuredData({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: serializeStructuredData(data) }}
      type="application/ld+json"
    />
  );
}
