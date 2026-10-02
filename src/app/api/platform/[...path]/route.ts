type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxy(request: Request, { params }: RouteContext) {
  const apiUrl = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL)?.replace(/\/$/, "");
  if (!apiUrl) {
    return Response.json({ message: "Platform API is not configured." }, { status: 503 });
  }

  const { path } = await params;
  const upstreamPath = path.map(encodeURIComponent).join("/");
  const search = new URL(request.url).search;
  const headers = new Headers({ Accept: "application/json" });
  const sessionCookieName = process.env.AUTH_SESSION_COOKIE ?? "metaplatform_session";
  const sessionCookie = request.headers.get("cookie")
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${sessionCookieName}=`));
  if (sessionCookie) headers.set("cookie", sessionCookie);

  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.text();

  let upstream: Response;
  try {
    upstream = await fetch(`${apiUrl}/${upstreamPath}${search}`, {
      method: request.method,
      cache: "no-store",
      redirect: "manual",
      headers,
      ...(body === undefined ? {} : { body }),
    });
  } catch {
    return Response.json({ message: "Platform API is unavailable." }, { status: 502 });
  }

  const responseHeaders = new Headers();
  const responseType = upstream.headers.get("content-type");
  if (responseType) responseHeaders.set("content-type", responseType);
  for (const cookie of upstream.headers.getSetCookie()) {
    responseHeaders.append("set-cookie", cookie);
  }
  const responseBody = await upstream.text();
  return new Response(responseBody || null, { status: upstream.status, headers: responseHeaders });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
