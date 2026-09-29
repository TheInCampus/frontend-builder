# Architecture

## Application boundaries

`apps/web` is the Next.js application shell. It owns routing, server-rendered
application pages, and shared navigation. The editor canvas is a React client
component, so drag-and-drop and live editing remain browser-side interactions.

`apps/api` is reserved for the NestJS service that will interpret BaseModel
definitions, expose generated CRUD APIs, execute workflows, and connect to Google
Sheets or hosted databases. Keep those APIs and data integrations out of Next.js route
handlers so they can be deployed and scaled independently.

`packages/types` contains configuration contracts shared across app surfaces.
`packages/builder-core` contains framework-independent component definitions and
configuration helpers. The editor and published runtime should consume the same
contracts and core helpers.

## Route map

- `/dashboard` — application dashboard shell.
- `/apps/[appId]/model` — BaseModel editor entry point.
- `/apps/[appId]/pages` — visual page builder.
- `/apps/[appId]/preview` — preview entry point.
- `/apps/[appId]/publish` — publishing entry point.
- `/runtime/[appId]/[[...slug]]` — published app route.
- `/login` and `/signup` — authentication entry points.

These feature routes are initial placeholders; they do not yet implement persistence,
authentication, generated APIs, or publishing.
