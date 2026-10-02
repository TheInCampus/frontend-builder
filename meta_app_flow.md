# Meta app flow: builder and preview

This document describes the current frontend implementation: how a user reaches an app, how builder components share state, how drafts are saved, and how the standalone preview reads that draft. The sketches supplied with the task also show navigation, pages, and forms authoring screens. Those are useful product direction, but they are not all implemented yet; the current builder is a small page-layout prototype.

## Entry points and routes

```text
/                         Landing page
  └── /apps               App list and create app
       └── /apps/[appId]  App overview
            ├── /apps/[appId]/builder   Visual page builder
            ├── /apps/[appId]/basemodel Basemodel editor
            └── /preview/[appId]       Standalone preview
```

- `src/app/page.tsx` is the landing-page entry point. Its workspace link goes to `/apps`.
- `src/app/(dashboard)/apps/page.tsx` mounts `AppsWorkspace`. `AppsWorkspace` loads apps and creates apps through the platform API.
- Selecting an app opens `/apps/[appId]`, which mounts `AppOverview`. Its actions link to the builder, Basemodel, and standalone preview.
- `src/app/(workspace)/layout.tsx` wraps workspace routes in `WorkspaceShell`. The app-specific `builder/page.tsx` resolves `appId` from the route and mounts `BuilderShell`.
- `/preview/[appId]` resolves the same app identifier and mounts `StandalonePreviewBar` and `PreviewApp`. It is a frontend preview route, not a deployed or public application URL.
- `/apps/[appId]/data` is an alias for the Basemodel editor.

The `appId` is the boundary used to choose the app's editor draft and Basemodel. It is passed from the route page into feature components rather than kept as a global selected-app value.

## Builder flow

```text
Route params (appId)
       │
       ▼
BuilderPage ──renders──> BuilderShell
                            │
                useBuilderState(appId)
                 ┌──────────┴──────────┐
                 ▼                     ▼
         Zustand builder store   localStorage draft
         (in-memory per appId)   canvas-builder:<appId>
                 │                     ▲
                 └── state changes ────┘
                            │
             ┌──────────────┼────────────────┐
             ▼              ▼                ▼
         Canvas       PropertyInspector   PreviewPanel
      select/reorder   edit/remove         render current
      components      selected item       component list
```

### Initializing and editing a page

1. `BuilderShell` calls `useBuilderState(appId)`. Until the hook loads, the store reports `ready: false`.
2. The hook reads the app-keyed browser draft using `loadPage(appId)`. If no valid draft exists, the component list starts empty. This builder page draft is currently browser-local; it is not loaded from the mock platform API.
3. `BuilderShell` passes the resulting component list and callbacks to its child components:
   - `ComponentPalette` reports a component type to `handleAdd`, by click or drag-and-drop.
   - `Canvas` renders the list, reports the selected component ID via `onSelect`, and exposes sortable drag targets.
   - `PropertyInspector` receives the selected component and reports edits or deletion through `onUpdate` and `onDelete`.
   - `PreviewPanel` receives the same component list when the in-editor Preview tab is selected.
4. Add, edit, remove, and reorder actions update the app-specific Zustand state. Selecting a canvas item is separate, temporary UI state held by `BuilderShell`; it is not part of the saved page.
5. When the component list changes, the hook serializes `{ components }` to localStorage under `canvas-builder:${encodeURIComponent(appId)}`. The builder's current save indicator reflects whether the hook has initialized; it does not report a server save or confirm that every browser-storage write succeeded.

The current component model is deliberately small: each component has an `id`, a `type` (`heading`, `text`, `button`, or `card`), a `label`, and `text`. The canvas renderer, inspector, and preview renderer handle these types directly.

### How builder components communicate

`BuilderShell` is the page-level coordinator. It owns the selected component ID and active Canvas/Preview tab, invokes the app-scoped state hook, and passes data and event callbacks down. Child components do not call one another directly:

- Palette action → `BuilderShell.handleAdd` → hook action → Zustand store → new `components` prop to Canvas/Preview.
- Canvas selection → `setSelectedId` in `BuilderShell` → derived selected component → PropertyInspector prop.
- Inspector update/delete → callback in `BuilderShell` → hook action → Zustand store → updated component list and local draft.
- Drag-and-drop events bubble to the parent `DndContext` handler in `BuilderShell`. Palette items identify themselves as palette components; canvas items identify themselves as canvas components. The handler adds supported palette types or asks the store to reorder existing components.

The shared in-memory state makes the editor canvas and its in-editor preview reflect the same edits without a network request.

## Basemodel and platform API flow

The Basemodel editor is a distinct feature from the visual page builder:

```text
/apps/[appId]/basemodel
       │
       ▼
DataModelingWorkspace
       │ useDataModel(appId)
       ├── TanStack Query cache: ["basemodel", appId]
       ├── localStorage: canvas-data-model:<encoded appId>
       └── same-origin API: /api/platform/metaplatform/apps/{appId}/basemodel
```

`useDataModel` first checks for an existing local Basemodel draft and otherwise tries the API, falling back to an empty model if the API is unavailable. Changes update the query cache, save locally, and are debounced before a best-effort `PUT` to the API. A browser-local Basemodel draft takes precedence over the API response when initializing.

Frontend API calls use `apiRequest` (`src/lib/api/client.ts`), which requests the same-origin `/api/platform/...` route. The Next.js route at `src/app/api/platform/[...path]/route.ts` forwards the request to `API_URL` (or `NEXT_PUBLIC_API_URL`) and forwards only the configured session cookie. In local development, `npm run mock-api` runs the mock API; `npm run mock-api:seed` creates the sample NaukriConnect app and data.

The API-backed app list/create flow and Basemodel sync are implemented. The standalone preview described below does **not** currently fetch Basemodel, pages, navigation, forms, or records from this API.

## Preview flow

### In-editor Preview tab

The Preview tab is inside `BuilderShell`. It passes the builder's current in-memory `components` directly to `PreviewPanel`. This preview updates immediately and does not need to reload the browser draft.

### Standalone preview route

```text
/preview/[appId]
       │
       ├── StandalonePreviewBar (back-to-editor link)
       └── PreviewApp(appId)
                │ on mount / appId change
                ▼
       loadPage(appId) from localStorage
                │
                ▼
       PreviewPanel(components)
                │
                ▼
       RenderComponent by type → preview DOM
```

`PreviewApp` reads the saved page draft once on mount and whenever `appId` changes, then stores its component list in local React state. `PreviewPanel` maps the list to heading, paragraph, button, or card elements. If there is no saved draft, it shows an empty-preview message. Changes made in another tab are not synchronized live; revisiting/reloading the preview causes it to read localStorage again.

The standalone preview and editor share the draft format and renderer, but not a live Zustand subscription: the editor preview uses current store state, while `/preview/[appId]` reads the persisted browser draft. Consequently, previewing an edit requires it to have been saved to localStorage first.

## Relationship to the supplied wireframe

The sketch depicts a broader authoring shell with Basemodel, Navigation, Pages, and Forms sections; navigation and page lists/details; a page canvas with a component palette; and application preview. In the current code:

- The Basemodel editor and visual page builder exist as separate routes.
- Builder canvas, palette, property inspector, in-editor preview, and standalone preview exist.
- App listing and app creation use the platform API.
- Dedicated navigation and forms authoring routes/screens are not present.
- The builder currently stores one flat component list per app, not a collection of named pages. Navigation, page-to-object binding, form submission, and record-backed rendering are not wired into preview.
- The mock API has app-scoped page, navigation, form, and record resources, but the current builder/preview components do not consume those resources.
- `src/app-engine` and `/engine-demo` are a separate runtime example; they are not the renderer used by `/preview/[appId]`.

Thus, the current end-to-end UI path is: create/select an app → build a simple page layout → edit its components → inspect the in-editor preview or open the standalone browser-local preview. The wider wireframe flow will require connecting page/navigation/form authoring data and runtime rendering to the API-backed app model.
