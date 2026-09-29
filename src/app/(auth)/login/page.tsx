import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="eyebrow">WELCOME BACK</div>
        <h1>Sign in to Canvas</h1>
        <p>Pick up where you left off.</p>
        <form className="auth-form">
          <label>Email address<input autoComplete="email" name="email" placeholder="you@example.com" required type="email" /></label>
          <label>Password<input autoComplete="current-password" name="password" placeholder="Enter your password" required type="password" /></label>
          <button className="button button-full" type="button">Continue</button>
        </form>
        <p className="auth-footer">New to Canvas? <Link href="/signup">Create an account</Link></p>
      </section>
    </main>
  );
}
