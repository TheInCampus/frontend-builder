import Link from "next/link";

export default async function AppOverviewPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  return (
    <div className="page-content">
      <div className="eyebrow">APP OVERVIEW</div>
      <h1>Untitled app</h1>
      <p className="page-lead">Your app is a blank canvas. Jump into the editor to get started.</p>
      <div className="overview-actions">
        <Link className="button" href={`/apps/${appId}/builder`}>Open builder <span aria-hidden="true">↗</span></Link>
        <Link className="button button-secondary" href={`/preview/${appId}`}>Preview app</Link>
      </div>
      <section className="overview-panel"><span className="panel-icon">✳</span><div><h2>Ready when you are</h2><p>Add components, arrange your page, and customize the details in the visual builder.</p></div></section>
    </div>
  );
}
