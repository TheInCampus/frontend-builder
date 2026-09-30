# frontend-builder

Visual drag-and-drop builder UI built with Next.js and React. Next.js provides
the application shell and routing; the interactive editor runs as a
client-side feature inside the same application.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The example workspace is
available at `/apps`; its builder is at `/apps/demo/builder`.

## Project structure

```text
src/
├── app/                  # App Router pages and layouts
│   ├── (auth)/           # Sign-in and sign-up screens
│   ├── (dashboard)/      # Authenticated app-management shell
│   └── preview/[appId]/  # Standalone published-app preview
├── components/           # UI shared across routes and features
├── features/builder/     # Browser-first editor, state and JSON persistence
├── lib/api/              # Client for the separate NestJS backend
├── styles/               # Shared design tokens
└── types/                # Shared application types
```

The builder is intentionally a client component because canvas interactions,
editor state, and local draft persistence require browser APIs. Route-level
pages and layouts remain in the Next.js App Router. Backend CRUD APIs belong in
the NestJS service; `src/lib/api/client.ts` is the frontend integration point.

Builder drafts currently save in browser `localStorage` as an MVP placeholder
until the backend's app/page persistence API is available. Authentication,
publishing, and deployment are UI scaffolds, not connected services.

The app data-model workspace is available at `/apps/[appId]/data`. It supports
creating, renaming, and deleting objects, and creating, editing, and deleting
typed fields, including relations between objects. Schema drafts are saved in
browser `localStorage` until the backend schema API is available; they are not
yet used to generate APIs or database tables.

## Styling

Styling is built on [Tailwind CSS](https://tailwindcss.com) (v4, CSS-first
configuration) paired with [DaisyUI](https://daisyui.com) for ready-made,
themeable components. Both are wired up in `src/styles/globals.css` via
`@import "tailwindcss";` and `@plugin "daisyui" { ... }`, with a custom
`canvas` DaisyUI theme that reuses the existing design tokens (`--ink`,
`--accent`, `--paper`, etc.) so DaisyUI components (`btn`, `card`, `navbar`,
...) match the current brand. New UI — including Forms, Pages, Navigation,
and Task/Workflow components exposed through the builder — should prefer
Tailwind utility classes and DaisyUI components over bespoke CSS.

## Configuration and checks

Set `NEXT_PUBLIC_API_URL` to the NestJS API base URL in `.env.local`.

```bash
npm run lint
npm run typecheck
npm run build
```
