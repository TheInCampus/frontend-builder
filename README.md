# Frontend Builder

The web app is a Next.js application shell with a client-side React visual builder. The
builder canvas, drag-and-drop interactions, and live editor state run in the browser.
Generated CRUD APIs and data connectors belong in the separate `apps/api` service,
not in Next.js route handlers.

## Getting started

Requirements: Node.js 20.9 or newer and pnpm 12.6.

```sh
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The starter workspace includes a
demo app at `/apps/demo/pages`; the model, preview, publish, and authentication routes
are structural placeholders until their features are implemented.

## Workspace

- `apps/web` — Next.js routes, application shell, and browser-only builder experience.
- `apps/api` — boundary and planned module layout for the future NestJS generated API
  service. It is intentionally not a running service yet.
- `packages/types` — shared page and component configuration types.
- `packages/builder-core` — shared component definitions and builder configuration
  helpers, usable by both the editor and published runtime.
- `docs` — architecture and local setup notes.

Useful commands:

```sh
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```
