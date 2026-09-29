import type { Metadata } from "next";
import Link from "next/link";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Canvas — Visual App Builder",
    template: "%s | Canvas",
  },
  description: "Design and preview applications with a visual builder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <Link className="brand" href="/">
            <span className="brand-mark">C</span>
            Canvas
          </Link>
          <nav aria-label="Main navigation" className="topbar-nav">
            <Link href="/apps">My apps</Link>
            <Link className="button button-small" href="/login">
              Sign in
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
