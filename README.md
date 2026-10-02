# Canvas — visual app builder

Canvas is an early-stage visual app-builder frontend built with React 19, Next.js App Router, and TypeScript. This repository contains the authoring UI and a development mock API so frontend work can continue while the Spring Boot service is being developed. It does **not** yet implement the full runtime-interpreted platform described in the original system blueprint.

## Current capabilities

- Email/password signup and sign-in screens, sign-out, and a privacy-preserving password-reset response. Auth requests go through same-origin Next.js routes.
- App listing and creation backed by the mock API.
- A visual page canvas with heading, text, button, and card blocks; component add, select, reorder, edit, remove, preview, and local draft restore.
- App-scoped Basemodel object/field editing for text, number, boolean, date, and relation fields. Drafts are stored locally and synchronized through the mock Basemodel API when available.
- English and Spanish interface translations, responsive UI, Tailwind CSS v4, DaisyUI v5, and the `canvas` theme.
- The authoring foundations currently use `@dnd-kit`, Zustand (client-only builder state), TanStack Query (remote/server state), React Hook Form, and Zod (auth form validation).

The page canvas and most page-editor state are still browser-local. Navigation and form editors, a runtime form renderer, publishing, generated SEO, custom-domain hosting, app export, and desktop packaging are not implemented. The mock API exposes some resource CRUD contracts for future screens; endpoint availability does not mean those screens or production behavior exist.

## Run locally with the mock API

Requirements: Node.js 20 or newer and npm.

```bash
npm install
cp .env.example .env.local
```

Run the mock API and Next.js app in separate terminals from the repository root:

```bash
npm run mock-api
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Create an account, then create an app from **My apps**. The mock API listens on `127.0.0.1:3001` by default; configure `MOCK_API_PORT` if that port is unavailable. `API_URL` in `.env.local` points the Next.js server-side proxies to the selected API.

Mock accounts and app/resource records are written to `mock-api/data.json` (ignored by Git); password hashes are stored, not plaintext passwords. Mock sessions are held in memory and are invalidated when the mock server restarts. Reset the mock account/resource store by stopping the server and deleting `mock-api/data.json`. Do not use real credentials or production data with the mock server.

## Mock API contract

The mock server is development-only and refuses to start when `NODE_ENV=production`. It binds to loopback rather than all network interfaces. Auth and platform requests from the browser use same-origin Next.js routes, which forward only the configured session cookie to the API.

| Method | Path | Behavior |
| --- | --- | --- |
| `POST` | `/metaplatform/auth/signup` | Create an account and issue a session cookie |
| `POST` | `/metaplatform/auth/signin` | Authenticate and issue a session cookie |
| `POST` | `/metaplatform/auth/signout` | Revoke the in-memory session and expire the cookie |
| `POST` | `/metaplatform/auth/forget` | Return a generic reset response; no email is sent |
| `GET`, `POST` | `/metaplatform/apps` | List the signed-in user's apps or create one |
| `GET`, `PUT` | `/metaplatform/apps/:appId/basemodel` | Read or replace the app's version-1 Basemodel |
| `GET`, `POST` | `/metaplatform/apps/:appId/{pages,navigations,forms}` | List or create app-scoped resources |
| `GET`, `PUT`, `PATCH`, `DELETE` | `/metaplatform/apps/:appId/{pages,navigations,forms}/:id` | Read, update, or delete an app-scoped resource |

Protected app resources require a valid mock session and are scoped to the owning account. Resource bodies are JSON objects and currently require a `name`; Basemodel bodies use `{ "model": { "version": 1, "objects": [] } }`. The mock implementation is a frontend integration aid, not a secure production identity service or a substitute for Spring Boot authorization, persistence, migrations, or recovery email.

### Connecting the Spring Boot service

Set `API_URL` in the Next.js server environment to the Spring Boot base URL, keep the API paths and response contract compatible (or adapt the proxy/client together), and use the backend's session-cookie name in `AUTH_SESSION_COOKIE`. Do not put database credentials or private service tokens in `NEXT_PUBLIC_*` variables. The backend must validate every protected request; the frontend middleware's cookie-presence check is only a navigation gate, not authorization.

## Repository structure

This is the structure that exists today; planned target modules are deliberately not represented as empty folders.

```text
src/
├── app/                         # Next.js routes, layouts, and same-origin API routes
│   ├── (auth)/                  # Login, signup, and password recovery
│   ├── (dashboard)/apps/        # App listing, overview, builder, and data model
│   ├── api/auth/[action]/       # Auth proxy
│   ├── api/platform/[...path]/  # Platform API proxy
│   └── preview/[appId]/
├── components/                  # Shared application components/providers
├── features/
│   ├── apps/                    # App listing, creation, and overview
│   ├── auth/                    # Auth forms, API calls, and sign-out
│   ├── builder/                 # Canvas, standalone preview, inspector, preview, state
│   └── data-modeling/           # Basemodel editor, serialization, and types
├── i18n/                        # English/Spanish messages and locale provider
├── lib/api/                     # Same-origin platform API client
└── styles/                      # Tailwind/DaisyUI theme and application styles

mock-api/server.mjs              # Standalone development API
discussion.md                    # Epic 0 planning and deferred Epic 2 backlog
```

## Architecture boundaries and roadmap

- **Implemented foundation:** authoring UI, local drafts, mock auth/app/Basemodel flows, same-origin API proxying, and reusable client libraries listed above.
- **Not production-ready:** mock accounts, in-memory sessions, mock data files, and localStorage drafts are development conveniences. Replace or migrate them when production Spring Boot persistence and session APIs are ready.
- **Deferred Epic 2:** the isolated interpreted app runtime, dynamic forms/data binding, metadata and structured-data SEO, public custom-domain routing, standalone build export, desktop/air-gapped packaging, expanded Indian locales, and tiered guest/paid integrations. These depend on product/security decisions and backend/runtime contracts; see the detailed stories and acceptance criteria in [`discussion.md`](discussion.md).
- The original blueprint's claims about generated database schemas, automatic REST/GraphQL compilation, AWS/Redis infrastructure, Java database drivers, GraalVM packaging, zero source exposure, and production SEO are design proposals—not capabilities currently delivered by this frontend.
- Browser bundles never connect directly to the mock or production API host: API traffic passes through same-origin Next.js routes. Database drivers and credentials belong in the backend, not this repository.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```
