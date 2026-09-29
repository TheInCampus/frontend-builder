import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="brand" href="/dashboard">
          <span className="brand-mark">F</span>
          <span>Frontend Builder</span>
        </Link>
        <h1>Create account</h1>
        <p>Account creation will be connected when the auth service is implemented.</p>
        <Link className="primary-link" href="/dashboard">
          Explore the workspace
        </Link>
        <Link className="auth-secondary" href="/login">
          Already have an account? Sign in
        </Link>
      </section>
    </main>
  );
}
