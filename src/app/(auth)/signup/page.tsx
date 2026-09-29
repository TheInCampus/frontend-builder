import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="eyebrow">START BUILDING</div>
        <h1>Create your account</h1>
        <p>Set up your workspace and bring your idea to life.</p>
        <form className="auth-form">
          <label>Your name<input autoComplete="name" name="name" placeholder="Jane Smith" required /></label>
          <label>Email address<input autoComplete="email" name="email" placeholder="you@example.com" required type="email" /></label>
          <label>Password<input autoComplete="new-password" minLength={8} name="password" placeholder="At least 8 characters" required type="password" /></label>
          <button className="button button-full" type="button">Create account</button>
        </form>
        <p className="auth-footer">Already have an account? <Link href="/login">Sign in</Link></p>
      </section>
    </main>
  );
}
