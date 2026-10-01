import type { AuthAction, AuthResponse } from "@/features/auth/types";

export async function submitAuthAction<TRequest>(
  action: AuthAction,
  payload?: TRequest,
): Promise<AuthResponse> {
  const response = await fetch(`/api/auth/${action}`, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
  });

  if (!response.ok) throw new Error(`Authentication request failed (${response.status}).`);
  if (response.status === 204) return {};
  try {
    return await response.json() as AuthResponse;
  } catch {
    return {};
  }
}
