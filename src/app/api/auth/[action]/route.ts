import type { AuthAction } from "@/features/auth/types";

const actions = new Set<AuthAction>(["signin", "signout", "signup", "forget"]);

type RouteContext = {
  params: Promise<{ action: string }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  const { action } = await params;
  if (!actions.has(action as AuthAction)) {
    return Response.json({ message: "Unsupported authentication action." }, { status: 404 });
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!apiUrl) {
    return Response.json({ message: "Authentication service is not configured." }, { status: 503 });
  }

  const sessionCookieName = process.env.AUTH_SESSION_COOKIE ?? "metaplatform_session";
  const sessionCookie = request.headers.get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${sessionCookieName}=`));

  let body: string | undefined;
  if (action !== "signout") {
    try {
      body = JSON.stringify(await request.json());
    } catch {
      return Response.json({ message: "Invalid request body." }, { status: 400 });
    }
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${apiUrl}/metaplatform/auth/${action}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...(sessionCookie ? { Cookie: sessionCookie } : {}),
      },
      ...(body === undefined ? {} : { body }),
    });
  } catch {
    return Response.json({ message: "Authentication service is unavailable." }, { status: 502 });
  }

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  for (const cookie of upstream.headers.getSetCookie()) {
    headers.append("set-cookie", cookie);
  }

  return new Response(await upstream.text(), { status: upstream.status, headers });
}
