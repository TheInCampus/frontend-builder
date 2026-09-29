export default async function RuntimePage({
  params,
}: {
  params: Promise<{ appId: string; slug?: string[] }>;
}) {
  const { appId, slug } = await params;

  return (
    <main className="runtime-page">
      <span className="eyebrow">PUBLISHED APP</span>
      <h1>{appId}</h1>
      <p>{slug?.join("/") || "Home page"}</p>
      <div className="placeholder-note">
        Published page rendering will use the shared builder configuration.
      </div>
    </main>
  );
}
