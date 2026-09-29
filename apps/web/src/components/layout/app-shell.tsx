import Link from "next/link";

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/apps/demo/model", label: "Data model" },
  { href: "/apps/demo/pages", label: "Page builder" },
  { href: "/apps/demo/preview", label: "Preview" },
  { href: "/apps/demo/publish", label: "Publish" },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/dashboard">
          <span className="brand-mark">F</span>
          <span>Frontend Builder</span>
        </Link>
        <div className="workspace-label">WORKSPACE</div>
        <nav aria-label="Main navigation" className="main-navigation">
          {navigation.map((item) => (
            <Link className="navigation-link" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <Link href="/login">Sign in</Link>
          <Link href="/signup">Create account</Link>
        </div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
