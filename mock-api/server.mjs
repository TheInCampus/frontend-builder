import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const port = Number(process.env.MOCK_API_PORT ?? 3001);
const cookieName = process.env.AUTH_SESSION_COOKIE ?? "metaplatform_session";
const dataFile = resolve(process.env.MOCK_API_DATA_FILE ?? "mock-api/data.json");
const sessions = new Map();
const sessionLifetimeMs = 1000 * 60 * 60 * 24 * 7;
let writeQueue = Promise.resolve();

if (process.env.NODE_ENV === "production") {
  throw new Error("The mock API is development-only and must not run in production.");
}

async function readStore() {
  try {
    return JSON.parse(await readFile(dataFile, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return { users: [], apps: [], pages: [], navigations: [], forms: [], basemodels: {} };
  }
}

async function writeStore(store) {
  writeQueue = writeQueue.then(async () => {
    await mkdir(dirname(dataFile), { recursive: true });
    const temporaryFile = `${dataFile}.${process.pid}.tmp`;
    await writeFile(temporaryFile, JSON.stringify(store, null, 2), { mode: 0o600 });
    await rename(temporaryFile, dataFile);
  });
  return writeQueue;
}

function send(response, status, value, headers = {}) {
  response.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    ...headers,
  });
  response.end(value === undefined ? "" : JSON.stringify(value));
}

async function readBody(request) {
  let raw = "";
  for await (const chunk of request) {
    raw += chunk;
    if (raw.length > 1_000_000) throw Object.assign(new Error("Request body is too large."), { status: 413 });
  }
  if (!raw) return {};
  try {
    const value = JSON.parse(raw);
    if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error();
    return value;
  } catch {
    throw Object.assign(new Error("Expected a JSON object request body."), { status: 400 });
  }
}

function parseCookies(header = "") {
  return new Map(header.split(";").map((part) => {
    const separator = part.indexOf("=");
    return separator < 0 ? ["", ""] : [part.slice(0, separator).trim(), part.slice(separator + 1).trim()];
  }));
}

function sessionCookie(token, maxAge = 60 * 60 * 24 * 7) {
  const secure = process.env.MOCK_API_SECURE_COOKIE === "true" ? "; Secure" : "";
  return `${cookieName}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`;
}

async function createPasswordHash(password) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

async function verifyPassword(password, encoded) {
  const [saltHex, hashHex] = encoded.split(":");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function requireString(value, field, maxLength = 200) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength) {
    throw Object.assign(new Error(`${field} is required and must be at most ${maxLength} characters.`), { status: 400 });
  }
  return value.trim();
}

function requirePassword(value) {
  if (typeof value !== "string" || !value.length || value.length > 1024) {
    throw Object.assign(new Error("Password is required and must be at most 1024 characters."), { status: 400 });
  }
  return value;
}

function isSafeSegment(value) {
  return typeof value === "string" && value.length > 0 && value !== "." && value !== ".." &&
    !value.includes("/") && !value.includes("\\");
}

async function handleAuth(request, response, action, store) {
  if (request.method !== "POST") {
    return send(response, 405, { message: "Use POST for authentication actions." }, { Allow: "POST" });
  }

  if (action === "signout") {
    const token = parseCookies(request.headers.cookie).get(cookieName);
    if (token) sessions.delete(token);
    return send(response, 204, undefined, { "Set-Cookie": sessionCookie("", 0) });
  }

  const body = await readBody(request);
  if (action === "forget") {
    requireString(body.email, "Email", 254);
    return send(response, 200, { message: "If an account exists, reset instructions have been sent." });
  }

  const email = requireString(body.email, "Email", 254).toLowerCase();
  const password = requirePassword(body.password);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw Object.assign(new Error("Enter a valid email address."), { status: 400 });
  }

  let user = store.users.find((candidate) => candidate.email === email);
  if (action === "signup") {
    if (user) throw Object.assign(new Error("An account with this email already exists."), { status: 409 });
    const name = requireString(body.name, "Name", 120);
    if (password.length < 8) throw Object.assign(new Error("Password must contain at least 8 characters."), { status: 400 });
    user = { id: randomBytes(16).toString("hex"), name, email, passwordHash: await createPasswordHash(password) };
    store.users.push(user);
    await writeStore(store);
  } else if (action === "signin") {
    const valid = user && await verifyPassword(password, user.passwordHash);
    if (!valid) throw Object.assign(new Error("Email or password is incorrect."), { status: 401 });
  } else {
    return send(response, 404, { message: "Unknown authentication action." });
  }

  const token = randomBytes(32).toString("base64url");
  sessions.set(token, { userId: user.id, expiresAt: Date.now() + sessionLifetimeMs });
  return send(response, action === "signup" ? 201 : 200, {
    user: { id: user.id, name: user.name, email: user.email },
  }, { "Set-Cookie": sessionCookie(token) });
}

function currentUser(request, store) {
  const token = parseCookies(request.headers.cookie).get(cookieName);
  const session = token && sessions.get(token);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  return store.users.find((user) => user.id === session.userId) ?? null;
}

function ownedApp(store, user, appId) {
  const app = store.apps.find((candidate) => candidate.id === appId && candidate.ownerId === user.id);
  if (!app) throw Object.assign(new Error("App not found."), { status: 404 });
  return app;
}

function validateResource(body, existing) {
  const name = requireString(body.name ?? existing?.name, "Name", 120);
  return { ...existing, ...body, id: existing?.id ?? randomBytes(16).toString("hex"), name };
}

function validateRecordData(input, object, store, appId) {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw Object.assign(new Error("Record data must be a JSON object."), { status: 400 });
  }
  const fields = new Map(object.fields.map((field) => [field.name, field]));
  for (const key of Object.keys(input)) {
    if (!fields.has(key)) {
      throw Object.assign(new Error(`Unknown field: ${key}.`), { status: 400 });
    }
  }
  const data = {};
  for (const field of object.fields) {
    const value = input[field.name];
    if (value === undefined || value === null || value === "") {
      if (field.required) throw Object.assign(new Error(`${field.name} is required.`), { status: 400 });
      continue;
    }
    const valid = field.type === "text" ? typeof value === "string" :
      field.type === "number" ? typeof value === "number" && Number.isFinite(value) :
      field.type === "boolean" ? typeof value === "boolean" :
      field.type === "date" ? typeof value === "string" && !Number.isNaN(Date.parse(value)) :
      field.type === "relation" ? typeof value === "string" && store.records.some((record) =>
        record.id === value && record.appId === appId && record.objectId === field.relatedObjectId) :
      false;
    if (!valid) throw Object.assign(new Error(`${field.name} has an invalid value.`), { status: 400 });
    data[field.name] = value;
  }
  return data;
}

async function handlePlatform(request, response, url, store) {
  const user = currentUser(request, store);
  if (!user) return send(response, 401, { message: "Authentication is required." });

  const segments = url.pathname.split("/").filter(Boolean).slice(1);
  if (segments[0] !== "apps") return send(response, 404, { message: "Unknown mock API route." });

  if (segments.length === 1) {
    const apps = store.apps.filter((app) => app.ownerId === user.id);
    if (request.method === "GET") return send(response, 200, { apps });
    if (request.method === "POST") {
      const body = await readBody(request);
      const app = { id: randomBytes(16).toString("hex"), name: requireString(body.name, "Name", 120), ownerId: user.id };
      store.apps.push(app);
      await writeStore(store);
      return send(response, 201, { app });
    }
    return send(response, 405, { message: "Method not allowed." }, { Allow: "GET, POST" });
  }

  const appId = decodeURIComponent(segments[1]);
  if (!isSafeSegment(appId)) return send(response, 400, { message: "Invalid app identifier." });
  const app = ownedApp(store, user, appId);
  const resourceName = segments[2];
  const resourceMap = { pages: store.pages, navigations: store.navigations, forms: store.forms };

  if (resourceName === "objects" && segments[4] === "records" && segments.length === 5) {
    const objectId = decodeURIComponent(segments[3] ?? "");
    if (!isSafeSegment(objectId)) return send(response, 400, { message: "Invalid object identifier." });
    const model = store.basemodels[appId] ?? { objects: [] };
    const object = model.objects.find((candidate) => candidate.id === objectId);
    if (!object) return send(response, 404, { message: "Basemodel object not found." });
    store.records ??= [];
    if (request.method === "GET") {
      const records = store.records.filter((record) => record.appId === app.id && record.objectId === objectId);
      return send(response, 200, { records });
    }
    if (request.method === "POST") {
      const body = await readBody(request);
      const record = {
        id: randomBytes(16).toString("hex"),
        appId: app.id,
        objectId,
        data: validateRecordData(body.data, object, store, app.id),
        createdAt: new Date().toISOString(),
      };
      store.records.push(record);
      await writeStore(store);
      return send(response, 201, { record });
    }
    return send(response, 405, { message: "Method not allowed." }, { Allow: "GET, POST" });
  }

  if (resourceName === "basemodel") {
    if (request.method === "GET") return send(response, 200, { model: store.basemodels[appId] ?? { version: 1, objects: [] } });
    if (request.method === "PUT") {
      const body = await readBody(request);
      if (!body.model || body.model.version !== 1 || !Array.isArray(body.model.objects)) {
        return send(response, 400, { message: "A version 1 basemodel is required." });
      }
      store.basemodels[appId] = body.model;
      await writeStore(store);
      return send(response, 200, { model: body.model });
    }
    return send(response, 405, { message: "Method not allowed." }, { Allow: "GET, PUT" });
  }

  const collection = resourceMap[resourceName];
  if (!collection) return send(response, 404, { message: "Unknown app resource." });
  const resourceId = segments[3] ? decodeURIComponent(segments[3]) : undefined;
  if (request.method === "GET" && !resourceId) {
    return send(response, 200, { [resourceName]: collection.filter((item) => item.appId === app.id) });
  }
  if (request.method === "POST" && !resourceId) {
    const body = await readBody(request);
    const resource = { ...validateResource(body), appId: app.id, updatedAt: new Date().toISOString() };
    collection.push(resource);
    await writeStore(store);
    return send(response, 201, { [resourceName.slice(0, -1)]: resource });
  }
  const index = collection.findIndex((item) => item.id === resourceId && item.appId === app.id);
  if (index < 0) return send(response, 404, { message: "Resource not found." });
  if (request.method === "GET") return send(response, 200, { [resourceName.slice(0, -1)]: collection[index] });
  if (request.method === "PUT" || request.method === "PATCH") {
    const body = await readBody(request);
    collection[index] = { ...validateResource(body, collection[index]), updatedAt: new Date().toISOString() };
    await writeStore(store);
    return send(response, 200, { [resourceName.slice(0, -1)]: collection[index] });
  }
  if (request.method === "DELETE") {
    collection.splice(index, 1);
    await writeStore(store);
    return send(response, 204);
  }
  return send(response, 405, { message: "Method not allowed." }, { Allow: "GET, POST, PUT, PATCH, DELETE" });
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host ?? "localhost"}`);
    const store = await readStore();
    const authMatch = url.pathname.match(/^\/metaplatform\/auth\/([^/]+)$/);
    if (authMatch) return await handleAuth(request, response, authMatch[1], store);
    if (url.pathname.startsWith("/metaplatform/")) return await handlePlatform(request, response, url, store);
    return send(response, 404, { message: "Not found." });
  } catch (error) {
    if (response.headersSent) return response.destroy();
    return send(response, error.status ?? 500, {
      message: error.status ? error.message : "Mock API request failed.",
    });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Development mock API listening at http://127.0.0.1:${port}`);
  console.log(`Mock data file: ${dataFile}`);
});
