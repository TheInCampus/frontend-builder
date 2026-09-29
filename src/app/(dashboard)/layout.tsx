import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="sidebar-label">WORKSPACE</div>
        <Link className="sidebar-link active" href="/apps"><span>▦</span> All apps</Link>
        <div className="sidebar-label sidebar-label-spaced">YOUR SPACE</div>
        <Link className="sidebar-link" href="/apps/demo"><span>◈</span> Untitled app</Link>
        <div className="sidebar-bottom">A simpler way to build.</div>
      </aside>
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
