import { AuthForm } from "@/features/auth/components/AuthForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const redirectTo = next?.startsWith("/apps/") && !next.startsWith("//") ? next : undefined;
  return <AuthForm mode="signin" redirectTo={redirectTo} />;
}
