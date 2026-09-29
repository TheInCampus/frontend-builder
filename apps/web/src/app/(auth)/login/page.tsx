import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="brand" href="/dashboard">
          <span className="brand-mark">F</span>
          <span>Frontend Builder</span>
        </Link>
        <h1>Sign in</h1>
        <p>Authentication will be connected when the auth service is implemented.</p>
        <Link className="primary-link" href="/dashboard">
          Continue to workspace
        </Link>
        <Link className="auth-secondary" href="/signup">
          Create an account
        </Link>
      </section>
    </main>
  );
}
