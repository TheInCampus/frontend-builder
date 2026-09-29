import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <span className="eyebrow">YOUR WORKSPACE</span>
          <h1>Applications</h1>
          <p>Manage your applications and continue building.</p>
        </div>
        <Link className="primary-link" href="/apps/demo/pages">
          Open demo builder
        </Link>
      </header>
      <section className="app-card">
        <div className="app-card-icon">D</div>
        <div className="app-card-copy">
          <h2>Demo application</h2>
          <p>A starter workspace for exploring the visual builder.</p>
        </div>
        <Link className="secondary-link" href="/apps/demo/pages">
          Continue building
        </Link>
      </section>
    </div>
  );
}
