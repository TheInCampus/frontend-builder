import Link from "next/link";

export default function AppsPage() {
  return (
    <div className="page-content">
      <div className="page-heading">
        <div><div className="eyebrow">YOUR WORKSPACE</div><h1>My apps</h1><p>Projects you’re building and exploring.</p></div>
        <Link className="button" href="/apps/demo/builder">Open starter app <span aria-hidden="true">↗</span></Link>
      </div>
      <Link className="app-card" href="/apps/demo">
        <div className="app-card-icon">◈</div>
        <div className="app-card-body"><h2>Untitled app</h2><p>Start with a blank canvas and make it yours.</p><span className="app-card-meta">Updated just now <span>·</span> Draft</span></div>
        <span className="app-card-arrow" aria-hidden="true">↗</span>
      </Link>
      <div className="empty-note">Your next great idea starts with a single component.</div>
    </div>
  );
}
