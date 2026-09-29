export function FeaturePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="feature-placeholder">
      <span className="eyebrow">WORKSPACE</span>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="placeholder-note">
        This workspace is ready for the feature implementation.
      </div>
    </section>
  );
}
