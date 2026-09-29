import Link from "next/link";

export default function HomePage() {
  return (
    <main className="landing">
      <div className="eyebrow"><span className="status-dot" /> YOUR IDEAS, IN THE MAKING</div>
      <h1>Build the app<br /><span>you have in mind.</span></h1>
      <p className="landing-copy">
        Go from a blank canvas to a working interface. Arrange components, tune
        their properties, and preview your app as you build.
      </p>
      <div className="landing-actions">
        <Link className="button" href="/apps">Open your workspace <span aria-hidden="true">↗</span></Link>
        <Link className="text-link" href="/signup">Create an account</Link>
      </div>
      <div className="landing-preview" aria-label="Builder workspace preview">
        <div className="preview-window-bar"><i /><i /><i /><span>Untitled app · Builder</span></div>
        <div className="preview-window-content">
          <div className="preview-mini-sidebar"><b /><b /><b /><b /></div>
          <div className="preview-mini-canvas">
            <div className="mini-heading" /><div className="mini-copy" />
            <div className="mini-button" /><div className="mini-card" />
          </div>
          <div className="preview-mini-inspector"><b /><i /><i /><i /></div>
        </div>
      </div>
    </main>
  );
}
