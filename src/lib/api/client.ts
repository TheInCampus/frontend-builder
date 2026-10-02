export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const normalizedPath = path.replace(/^\/+/, "");
  const response = await fetch(`/api/platform/${normalizedPath}`, {
    ...init,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}.`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
