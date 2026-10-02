# Epic 0 — Builder configuration workspace

**Status:** Discussion draft — requirements are not all approved.  
**Scope:** The four configuration areas are **Basemodel, Navigations, Pages, and Forms**. This is the latest direction for Epic 0 and supersedes the earlier mention of a **Task** navigation item.  
**Purpose:** Collect the known requirements and a detailed proposed product/technical plan in one place. Items explicitly marked **Decision needed** must be discussed before treating them as committed behavior.

## 1. Product goal

Provide a cohesive workspace where an app builder can define the data model, configure navigation, create and compose pages, and build reusable forms. The builder should make these resources understandable both independently and in relation to one another: pages can use forms, forms can bind to Basemodel fields, and navigation entries can lead to pages.

## 2. What has been discussed

The following requirements were stated in the discussion:

- The builder entry point is `/builder`.
- Its primary navigation has four areas: **Basemodel, Navigations, Pages, and Forms**.
- Selecting an area opens its listing page.
- The page listing is at `/builder/page`.
- A **Create Page** action opens a modal with a form for basic page metadata.
- Creating a page takes the user to `/builder/page/:id`.
- A page editor has drag-and-drop options for composing page components.
- Selecting a component exposes configuration in a form, either in a modal or a side panel.
- Component configuration depends on the component. For example, a navigation component has navigation options; a form text field can have a field name, field label, required state, condition, and CSS class.
- The Epic 0 issue label already exists as **Epic - 0** and should be used on related issues.

This document expands those requirements into a reviewable proposal. It does not assume that the proposed field catalogs, action behaviors, persistence contract, or route names beyond the explicitly discussed page routes have been approved.

## 3. Product principles

1. **Configuration is explicit:** Users should be able to see which resource they are editing and which settings apply to it.
2. **One source of truth:** Forms bind to Basemodel definitions rather than inventing incompatible field types or names.
3. **Predictable navigation:** Resource lists, create flows, editors, and return paths should behave consistently.
4. **Progressive disclosure:** Show common settings first; place advanced conditions and styling options in a clearly identified advanced section.
5. **Safe editing:** Validate before saving, explain destructive effects, and avoid losing unsaved work without warning.
6. **Accessible alternatives:** Drag-and-drop is optional convenience; every core action also has a keyboard- and pointer-accessible alternative.
7. **Localized from the start:** New interface copy belongs in the existing locale resources, currently English and Spanish.
8. **Separate draft UX from backend readiness:** Current builder and schema drafts use app-scoped browser storage as placeholders. Production multi-user data must use authenticated backend APIs when available.

## 4. Proposed information architecture

### 4.1 Routes

| Area | Proposed route | Purpose |
| --- | --- | --- |
| Builder home | `/builder` | Entry point, area navigation, and overview of the current app's configuration resources |
| Basemodel | `/builder/basemodel` | List, create, and open data objects/models |
| Navigations | `/builder/navigation` | List and configure navigation definitions |
| Pages | `/builder/page` | List and create pages |
| Page editor | `/builder/page/:id` | Compose and configure one page |
| Forms | `/builder/form` | List and create forms |
| Form editor | `/builder/form/:id` | Configure a form and its fields |

**Decision needed:** The required page URLs are singular (`/builder/page` and `/builder/page/:id`). Decide whether the other collection paths should use singular (`/builder/navigation`, `/builder/form`) or plural (`/builder/navigations`, `/builder/forms`) consistently. Decide whether `/builder` is app-scoped or requires an app identifier in its path/query. Existing app workspaces are addressed by `appId`; this must be reconciled before routes are finalized.

### 4.2 Shared builder shell

The shell should contain:

- A builder/app identity area with a way back to the workspace or app overview.
- Primary navigation for Basemodel, Navigations, Pages, and Forms.
- An active-area indicator and a clear page title.
- A consistent content region for listing or editing.
- Save status where a resource is being edited.
- Responsive navigation for narrow screens.

The shell should not imply features are complete just because their navigation entry exists. Areas that are not yet implemented should show an intentional empty/coming-next state rather than a dead link.

## 5. Configuration areas

### 5.1 Basemodel

**Goal:** Define the app's reusable data objects, fields, and relationships.

**Proposed listing**

- Show model/object name, field count, and an update indicator when available.
- Provide create, open/edit, and delete actions.
- Include a useful empty state that explains what a Basemodel object represents.
- Support search/filter once the number of objects makes a long list difficult to navigate.

**Proposed object metadata**

- Stable object ID.
- Display name; a machine-safe key/slug may be derived or entered separately.
- Optional description.
- Fields in an explicitly managed order.

**Proposed field metadata**

- Stable field ID.
- Machine name/key and user-facing label.
- Type; the current data-model UI has text, number, boolean, date, and relation.
- Required/optional constraint.
- Optional default value and description/help text.
- For relation fields, a target object and relationship direction/cardinality.

**Proposed behaviors**

- Create, rename, edit, and delete objects and fields.
- Prevent duplicate object names and duplicate field names within an object, using case-insensitive comparison unless a final naming policy says otherwise.
- Validate names and required type-specific settings before saving.
- Show references before deleting an object or field. Prevent deletion while references would become invalid, or require the user to update/remove those references first.
- Editing a field type must warn when existing form bindings or page components would no longer be valid.
- Keep stable IDs when names or labels change so dependent resources do not break.

**Acceptance criteria**

- Users can create and reopen objects with their fields intact.
- Field types and required state are visible in both the editor and object summary.
- Relations point only to existing objects and cannot silently become orphaned.
- Invalid or duplicate definitions are explained inline and are not saved.
- Destructive operations clearly state what will be removed or blocked.

**Decision needed**

- Is “Basemodel” one model per app, a collection of named objects, or both (an app model containing objects)?
- Which types beyond the current five are in the first release (e.g. long text, email, URL, enum, file)?
- Are machine keys generated from display names, manually entered, or both?
- What relation cardinalities are required?
- Are defaults, unique/index constraints, and descriptions in the first slice?

### 5.2 Navigations

**Goal:** Configure reusable navigation structures and their destinations.

**Proposed listing**

- Show navigation name, item count, and status if publication/draft state is introduced.
- Provide create, open/edit, duplicate (optional), and delete actions.
- Explain how a navigation definition can be attached to a page or application shell.

**Proposed navigation item metadata**

- Stable item ID.
- Display label.
- Destination kind: internal page, external URL, or action (final supported kinds need agreement).
- Destination reference/value.
- Position/order.
- Optional visibility condition.
- Optional open-in-new-tab behavior for external links.
- Optional icon/accessibility label, if icons are part of the design system.

**Proposed behaviors**

- Add, rename, remove, and reorder items.
- Support nested items only if hierarchical navigation is approved; otherwise keep a flat list for the first release.
- Validate internal destinations against pages available in the same app.
- Validate external URLs and clearly distinguish them from internal links.
- Preview the configured navigation and show broken/missing destinations.
- Component-level configuration should select a reusable navigation definition where possible, rather than duplicate the entire definition on every page.

**Acceptance criteria**

- A user can create a named navigation, add destinations, reorder items, and reopen it without losing configuration.
- Internal links reference valid pages; invalid references are surfaced before save.
- The page editor can add a navigation component and select/configure the navigation definition.
- Keyboard controls provide a non-drag way to reorder items.

**Decision needed**

- Are navigations global to the app, page-specific, or both?
- Should nested menus, icons, visibility conditions, active-route styling, and external links be included in the initial release?
- What should happen if a target page is deleted?

### 5.3 Pages

**Goal:** Let users create, manage, and visually compose app pages.

**Page listing at `/builder/page`**

- Show page name/title, route/slug if defined, and status/updated timestamp when available.
- Provide **Create Page**, open/edit, and delete actions.
- Include search/filter only if the expected app scale warrants it.
- Provide an empty state with a create-page action.

**Create Page flow**

- Open a modal dialog from **Create Page**.
- Collect at minimum the basic page metadata. The current ticket proposes page name/title first; slug/route, description, and status need confirmation.
- Validate required values and per-app uniqueness (for example, page route/slug).
- Cancel closes without creating a page.
- Successful submission creates a stable ID and navigates to `/builder/page/:id`.
- Prevent duplicate submission and show progress/errors.

**Page editor**

- Load the selected page by stable ID and show its title and save status.
- Provide a component palette and a canvas/workspace.
- Support adding components by drag-and-drop and by an accessible click/keyboard alternative.
- Show selection, allow reorder and removal, and preserve component order.
- Display empty-canvas guidance, load/save errors, and a clear way back to the listing.
- Open a component-specific configuration form in a side panel or modal when selected.
- Provide preview at a suitable stage; live publication is not included unless separately agreed.

**Initial component categories (proposal)**

- Layout/content: heading, text, image, card/container, divider.
- Actions: button/link.
- Navigation: configured navigation component.
- Form embedding: embed/select a reusable form.

This list is a proposal, not a final component catalog. Each component requires a defined rendering behavior and configuration schema before implementation.

**Acceptance criteria**

- A user can create a page with valid basic metadata and arrives at its editor.
- The page listing reflects created pages and provides an open action.
- Components can be added, selected, reordered, configured, and removed.
- Reopening the editor restores page metadata and component configuration.
- Failed validation or persistence leaves the user’s current draft intact and explains recovery options.

**Decision needed**

- Required page metadata beyond name/title: slug, description, route, template, visibility, status?
- Can pages be duplicated, archived, or deleted? What happens to navigation links/forms that reference them?
- What are the first supported component types and layout model (free positioning, vertical flow, grid/sections)?
- Is component configuration saved immediately, explicitly, or both (autosave with status)?

### 5.4 Forms

**Goal:** Create reusable forms from Basemodel fields, configure presentation and validation, and define submission behavior.

**Proposed listing**

- Show form name, field count, and update/status information when available.
- Provide create, open/edit, and delete actions.
- Provide empty state and form search/filter as needed.

**Proposed form metadata**

- Stable form ID.
- Name and optional description.
- Ordered fields/sections.
- Optional success message and submit-button label.
- Submission destination/action, pending backend/API design.

**Proposed field configuration**

Required by the discussion for text fields:

- Field name/key.
- Field label.
- Required flag.
- Conditional display/enable rule.
- CSS class.

Additional proposed settings, to confirm per type:

- Field type or binding to a Basemodel field.
- Placeholder and help text.
- Default value.
- Validation constraints (length, range, pattern) where meaningful.
- Disabled/read-only state.
- Option list for select/radio/checkbox groups.
- Error/help copy.
- Layout/width.

**Proposed behaviors**

- Create a form, add fields, reorder fields, configure, preview, and save.
- Prefer binding a field to a Basemodel field; allow unbound presentation-only fields only if there is a defined use case.
- Derive compatible controls from the bound field type and prevent incompatible bindings.
- Model conditions as validated structured rules, not arbitrary executable code.
- Show condition dependencies and warn if a referenced field is removed or renamed.
- Provide field-level validation and a form preview.
- Keep submission/runtime behavior separate from configuration until the backend contract and data-writing policy are agreed.

**Acceptance criteria**

- A form can be created and reopened with the same field order and configuration.
- Selecting a form field opens the correct contextual configuration.
- Required, condition, label, name, and CSS-class settings persist.
- Bound fields must exist in the chosen Basemodel and use compatible types.
- Invalid conditions and duplicate/empty field names are blocked with accessible explanations.
- A preview can demonstrate field labels, required indicators, and conditional visibility.

**Decision needed**

- Are forms always tied to a Basemodel object? Can one form combine fields from multiple objects?
- Which input types are required in the first release?
- What expression language/operators are supported for conditions?
- What is the submission contract (create/update record, custom API action, workflow/task)?
- Are CSS classes unrestricted strings, constrained tokens, or replaced with style controls?
- Are sections, multi-step forms, repeaters, file uploads, and server-side validation in scope?

## 6. Shared interaction and quality requirements

### 6.1 Create/edit dialogs and contextual panels

- Every dialog has a descriptive title, labelled controls, visible Cancel and Save actions, and a predictable close behavior.
- Escape/close with unsaved changes asks for confirmation or preserves a recoverable draft.
- Contextual side panels expose the selected component/resource identity and do not silently apply edits to a different selection.
- Inline validation explains the field-level correction; general save failures are announced accessibly.
- Pending actions prevent accidental duplicate submission.

### 6.2 Drag-and-drop

- Indicate valid drop targets and current insertion position.
- Reject unsupported/invalid drops without modifying the page.
- Provide Add/Move controls usable by keyboard and pointer without drag.
- Announce reorder/add/remove outcomes to assistive technology.

### 6.3 Persistence and ownership

- Drafts are scoped to the current application and user.
- Existing localStorage persistence is MVP-only; it is not a multi-device or authoritative persistence solution.
- Define a versioned serializable representation for each resource and handle invalid/older drafts safely.
- Before production use, persist through authenticated backend APIs and ensure backend authorization checks ownership on every read/write.
- Define autosave/explicit save semantics, conflict handling, retry behavior, and visible save status before connecting persistence.

### 6.4 Localization and accessibility

- Put all visible strings, validation, confirmations, empty states, and errors in locale resources.
- Keep document language synchronized with the selected locale.
- Label form controls and dialogs; preserve keyboard focus; provide focus-visible states and accessible status/alert announcements.
- Support narrow screens by converting side panels to an accessible drawer/dialog if needed.
- Avoid relying on color, drag gestures, icons, or placeholder text alone to convey meaning.

### 6.5 Security and data safety

- Do not place credentials, session tokens, or sensitive form contents in localStorage.
- Conditions must be data expressions evaluated by trusted application code, never arbitrary user-supplied JavaScript.
- Sanitize/validate CSS-class or styling input according to the eventual rendering strategy.
- Escape user-entered labels and content in previews and generated output.
- Enforce authentication and per-app authorization server-side; client route guards are not authorization.
- Confirm destructive actions and handle references between Basemodel, Navigations, Pages, and Forms.

## 7. Suggested delivery sequence and priorities

Priorities are relative planning proposals, not estimates.

| Phase | Priority | Deliverable | Depends on |
| --- | --- | --- | --- |
| 0 | High | Agree app scope, route naming, persistence boundary, and initial resource schemas | Product/backend decisions |
| 1 | High | `/builder` shell and navigation across all four areas, with useful placeholder/empty states | Phase 0 route decisions |
| 2 | High | Basemodel object/field CRUD and stable schema representation | Resource schema and persistence choice |
| 3 | High | Page listing, Create Page dialog, metadata validation, and page-editor route | Phase 1; page metadata decisions |
| 4 | High | Page canvas, palette, selection, reorder, remove, and draft restore | Phase 3; component model |
| 5 | Medium | Reusable navigation definitions and navigation component configuration | Pages/routes; destination model |
| 6 | Medium | Form listing/editor, field configuration, Basemodel bindings, and preview | Basemodel and condition-rule decisions |
| 7 | Medium | Cross-resource reference validation, deletion safeguards, and robust save/recovery | All resource models |
| 8 | Later | Advanced layout, nested navigation, multi-step forms, richer conditional rules, publishing/runtime submissions | Usage feedback and backend capabilities |

**Dependency note:** Forms depend on a settled Basemodel field model. Page navigation components depend on a page identity/route model. Page embedding depends on a Forms model. These contracts should be agreed before implementing their dependent editors.

## 8. Proposed feature/story breakdown

These are planning candidates for Epic 0. They can be split into GitHub issues after review.

1. **Builder shell and route navigation** — `/builder`, four area entries, active state, responsive behavior, useful placeholder states.
2. **Basemodel object and field management** — model/object/field CRUD, typing, relationships, validation, reference-safe deletion.
3. **Page listing and page creation** — `/builder/page`, metadata modal, validation, stable page IDs, empty/error states.
4. **Page editor and component canvas** — `/builder/page/:id`, palette, accessible add/reorder/select/remove, restore saved draft.
5. **Contextual component configuration** — per-component configuration schemas and inspector/modal behavior.
6. **Navigation definitions and menu editor** — navigation CRUD, destination references, item ordering, preview and component binding.
7. **Form listing and form editor** — form metadata, field palette, field ordering, contextual configuration and preview.
8. **Basemodel/form binding and conditions** — compatible field binding, validation rules, structured conditions and dependency warnings.
9. **Cross-resource persistence and integrity** — versioned data, app/user scope, backend API integration, retry/conflict behavior.
10. **Polish and quality** — localization, accessibility, responsive interaction, destructive-operation safeguards, error/empty/loading states.

## 9. Verification plan

For each resource, cover create/read/update/delete, validation, duplicate names, persistence failure, reload/restore, and reference integrity.

For the page editor, verify drag/drop and non-drag add/reorder, component selection, configuration persistence, invalid drop behavior, and unsaved-change handling.

For navigation and forms, verify valid and broken page references, deleted/renamed Basemodel bindings, conditional-rule validation, preview output, and keyboard operation.

Across the workspace, verify route navigation, app isolation, authentication/authorization at the backend boundary, locale changes, responsive layout, accessible labels/focus/status announcements, and legacy routes remaining unaffected.

## 10. Decisions to resolve before implementation

1. Is `/builder` bound to one app context? If so, how is the current `appId` selected or represented in routes?
2. Confirm exact paths for Basemodel, Navigations, and Forms; confirm singular/plural convention.
3. Confirm the Basemodel model/object distinction, initial field types, relationship cardinality, and machine-key rules.
4. Confirm page metadata fields, slug/route uniqueness, and delete/duplicate/archive behavior.
5. Confirm first-release page components and layout/reordering model.
6. Confirm whether navigation is reusable per app or configured per page, and whether nested items/conditions are needed initially.
7. Confirm whether forms bind to one Basemodel object, what input types ship first, and whether form submission is included.
8. Define the supported conditional-rule language and validation semantics.
9. Decide whether editing autosaves, uses explicit save, or supports both.
10. Confirm when local browser drafts transition to backend persistence and how existing drafts migrate.
11. Confirm initial locale requirements for these new builder screens; the current app contains English and Spanish resources.
12. Reconcile existing Epic 0 issues with this four-area scope: current issue #13 and #14 mention **Task**, and the earlier child issues divide page canvas/configuration differently. Update or split issue scope and priorities after agreement.

## 11. Current repository context

- The app uses Next.js App Router with the visual builder currently under `/apps/[appId]/builder`.
- The existing builder supports a small component set (heading, text, button, card) and app-scoped localStorage drafts.
- The existing data-modeling screen supports object and field editing with text, number, boolean, date, and relation types; schema drafts are app-scoped localStorage placeholders.
- Backend app/page and schema persistence APIs are not represented as ready in the current README.
- The existing locale resources cover English and Spanish.
- The UI stack is Tailwind CSS v4 and DaisyUI v5 with the custom `canvas` theme. New UI should reuse that stack.

This context describes the current implementation, not a commitment to preserve its data shape or localStorage approach for the production builder.

---

# Epic 2 — Runtime, Distribution, and Platform Readiness (Proposed)

**Status:** Deferred planning backlog. These items are not part of the currently delivered authoring MVP. The numbering is for discussion and can be changed when stories are created as tracked issues.

## 12. Epic goal and boundaries

**Goal:** Let an authorized app owner take a validated app configuration from the builder and securely run it as an independently routable application, then choose a supported hosting or distribution path without exposing platform administration capabilities.

**User outcome:** An app owner can preview and publish a versioned application whose pages, data, navigation, forms, language, and metadata agree with its saved configuration. Depending on later product decisions, the owner can host it on a platform URL or verified custom domain, export a supported artifact, or install an explicitly scoped desktop package.

### Included

- A versioned, validated runtime configuration contract and a runtime renderer separated by module boundary from the authoring UI.
- Runtime route resolution, layouts/components, data access, generated forms, navigation, error/empty states, and server-rendered metadata.
- Production persistence/API integration, app/version isolation, publication lifecycle, entitlement checks, and migration from browser drafts.
- Expanded runtime localization, verified custom-domain routing, a constrained export workflow, and a desktop/offline feasibility implementation if that product direction is approved.
- Security, accessibility, operational visibility, and automated verification needed for the above.

### Excluded unless separately approved

- Treating a browser-only export as source-code protection: downloaded JavaScript can be inspected, so obfuscation/minification cannot guarantee secrecy.
- Automatically compiling arbitrary user-defined schemas into database DDL or exposing arbitrary REST/GraphQL resolvers.
- Choosing a hosting vendor, cloud region, database, cache, desktop framework, billing provider, SMS provider, or payment provider before architecture, compliance, and cost review.
- Promising air-gapped operation before offline persistence, synchronization, authentication, backup, and data-conflict behavior have been specified.
- Using browser-controlled client claims as authorization. The backend remains authoritative for identity, tenant boundaries, and entitlements.

## 13. Proposed stories

### E2.1 — Agree and version the published application contract

**User story:** As a platform engineer, I need one versioned, validated application document so the editor, API, runtime, preview, SEO resolver, and export process interpret saved applications consistently.

**Description:** Define the supported page, component, route, navigation, Basemodel, form, localization, metadata, and publication shapes. The contract must distinguish editable drafts from immutable published versions, define stable identifiers and references, and include schema validation and explicit migration behavior. Keep unknown or unsupported fields from being executed as code.

**Acceptance criteria**
- Contract and supported version are documented and validated at API boundaries; invalid shape, unsupported version, duplicate identifiers, and broken references receive actionable errors.
- Draft writes do not mutate an already published version; a publication records the exact contract version and content revision.
- Migration is deterministic, tested against retained fixtures, and reports fields that cannot be migrated instead of silently discarding them.
- The mock contract is identified as a test/development approximation; production contract decisions are approved with the Spring Boot API owners.

**Dependencies:** Epic 0 resource schemas; Spring Boot API and persistence design.

### E2.2 — Build the isolated, server-renderable application runtime

**User story:** As a public visitor, I want an application route to render the app owner's published pages so that the application is usable without opening the editor.

**Description:** Create a runtime module with an explicit dependency boundary from builder-only components. Resolve an app and route to a published configuration and render only an allowlisted set of runtime components. Support loading, not-found, unavailable, and invalid-configuration states; resolve navigation and page paths using stable page IDs and validated slugs.

**Acceptance criteria**
- A visitor can load the root route and supported nested page routes directly, refresh them, and navigate between published pages without relying on editor state.
- Only published versions render publicly; draft preview is separately authorized and cannot accidentally become public.
- Unsupported component types and broken references degrade to a safe visible error/placeholder and are observable, not dynamically imported or evaluated.
- Server-rendered HTML and client hydration use the same versioned configuration and handle empty, missing, and unpublished apps consistently.
- Runtime chunks do not import builder inspectors, authoring state stores, or editor-only controls; this is verified by a bundle/dependency check.

**Dependencies:** E2.1, E2.12 publication/version-read APIs, production app lookup API.

### E2.3 — Connect runtime data to production backend services

**User story:** As an app owner, I want my published app to read data through authorized platform APIs so that runtime views show records without any browser-to-database access.

**Description:** Agree which data services the backend exposes for published applications, what public/private record access means, and how app, user, and record scopes are enforced. Define safe query and filter capabilities from component bindings; do not generate database drivers or arbitrary query language in the frontend.

**Acceptance criteria**
- Every read/write API validates the authenticated identity or explicitly public access policy and verifies both `appId` and resource/record ownership on the backend.
- Browser code calls only documented same-origin/API-gateway endpoints; database credentials and privileged service tokens never enter client bundles.
- Runtime query shapes are allowlisted and bounded (fields, page size, sort/filter operators); invalid or excessive queries are rejected.
- Loading, empty, permission-denied, expired-session, network, and server-error states are represented without exposing stack traces or sensitive records.
- Integration tests prove cross-app and cross-tenant reads/writes are denied, including manipulated IDs and stale publication references.

**Dependencies:** E2.1; production Spring Boot authentication, tenancy, and data API contracts.

### E2.4 — Render schema-driven forms and process submissions

**User story:** As an app owner, I want a published form to derive its fields and validation from the saved form and Basemodel so visitors can submit data that follows the app's schema.

**Description:** Build runtime form controls from the approved field-definition registry, construct runtime validation from declarative constraints, and bind submission to an explicitly selected object/API. Keep React Hook Form and Zod as implementation tools, not as permission or trust boundaries; the backend validates submitted data again.

**Acceptance criteria**
- Supported field types, required rules, length/range constraints, and supported relation selectors render with accessible labels, descriptions, errors, keyboard operation, and localized messages.
- A form with an unsupported field, deleted binding, invalid condition, or incompatible Basemodel version cannot submit and reports a recoverable configuration error.
- Validation constraints are compiled only from validated declarative configuration; no `eval`, executable expression, or arbitrary schema code is accepted.
- Submission uses a same-origin API path and server-side validation, applies app-level authorization/rate limits, and gives the visitor a clear success/failure state without leaking private API responses.
- Unit and integration tests cover valid/invalid values, relations, conditional visibility, duplicate submission, timeout, and authorization denial.

**Dependencies:** E2.1, E2.3, finalized Forms and Basemodel semantics, privacy/retention decisions.

### E2.5 — Generate safe metadata and structured data for public pages

**User story:** As an app owner, I want public pages to expose accurate page titles, descriptions, canonical URLs, and supported structured data so search engines can understand content I have chosen to publish.

**Description:** Provide validated metadata templates and a server-side resolver based on public, explicitly exposed fields. Support static defaults and optional object-backed pages. Treat the README's job-portal/JobPosting example as illustrative only; structured data types and required fields need per-product validation and must never imply that indexing/ranking is guaranteed.

**Acceptance criteria**
- Metadata resolution is server-side for crawler-visible routes and respects the published version, canonical route, app visibility, locale, and no-index settings.
- Template variables resolve only to allowlisted public fields with bounded output lengths; missing or invalid values fall back to safe defaults.
- JSON-LD output is serialized safely (including `<`, `>`, `&`, and script-closing sequences); user values cannot inject executable markup.
- Draft/private records are never exposed through metadata, JSON-LD, canonical URLs, or preview routes to anonymous visitors.
- Tests cover missing fields, special characters, unknown tokens, unpublished/deleted records, no-index, localization, and representative schema validation.

**Dependencies:** E2.1–E2.3; product-approved public-data policy and metadata rules.

### E2.6 — Expand runtime localization and namespace loading

**User story:** As an app owner or visitor, I want the platform UI and published app to use supported regional languages consistently so people can author and use apps in their preferred language.

**Description:** Evolve the current English/Spanish UI resources toward the target English, Hindi, Marathi, Tamil, and Telugu set only after translation ownership and review are established. Separate platform UI strings from app-authored content and runtime namespaces; define locale negotiation, explicit selection, fallback, date/number formatting, and direction handling.

**Acceptance criteria**
- The initial approved locale list and translation source of truth are explicit; every required key has a reviewed translation or a deliberate English fallback.
- Locale is selected consistently for server rendering and client hydration; switching it does not corrupt the current route or saved drafts.
- Runtime-loaded namespaces are limited to the active feature/locale and are not used as a substitute for translating user-authored content.
- Locale fallback and unsupported locale behavior are deterministic and tested; localized labels, validation, metadata, and date/number formatting are covered.
- Right-to-left layout support is not claimed unless a right-to-left locale is approved and layout, keyboard, and visual QA are completed.

**Dependencies:** Product locale approval, E2.2/E2.4 runtime surfaces, translation review process.

### E2.7 — Add guest trial, account entitlements, and draft migration

**User story:** As a prospective user, I want to try approved basic authoring without an account and retain my work if I sign up, while paid or restricted capabilities remain enforced securely.

**Description:** Specify which features are available anonymously and which require an account or entitlement. Preserve only non-sensitive guest drafts in browser storage, bind them to a newly authenticated account after explicit confirmation, and resolve collisions with existing server drafts. Access decisions must be enforced by backend APIs as well as reflected in frontend navigation.

**Acceptance criteria**
- Guest access policy lists allowed actions, quotas, retention/expiry, and restricted capabilities; no tier is inferred from a client-side flag.
- An unauthenticated visitor can create and edit an approved trial draft; restricted actions explain the requirement and preserve the draft.
- Sign-up/sign-in offers a safe draft import/migration flow with a preview, duplicate handling, cancellation, and recovery if migration fails.
- Backend endpoints reject forged guest/paid entitlement claims and verify ownership before attaching drafts to an account.
- Logout/account-switch behavior does not expose another user's cached app data; sensitive tokens and passwords are never stored in localStorage.

**Dependencies:** Product pricing/access decisions, production auth/entitlement APIs, E2.1 and draft migration rules.

### E2.8 — Provide a constrained integrations framework

**User story:** As an authorized app owner, I want to configure approved integrations such as messaging or payment providers without exposing provider credentials to visitors or the browser.

**Description:** Treat the README's SMS/payment nodes as possible future integrations, not built-in requirements. Establish provider review, credential storage, consent, rate limits, webhook authenticity, regional/legal requirements, and sandbox-vs-production configuration before adding any provider adapter.

**Acceptance criteria**
- Only reviewed integrations are offered, with documented permissions, data passed, costs, regional availability, failure behavior, and sandbox controls.
- Secrets are stored and used by backend services only; the browser and exported public runtime never receive provider credentials.
- Payment or messaging side effects require explicit user actions/consent where applicable, backend validation, idempotency, abuse limits, and auditable outcomes.
- Webhooks validate authenticity and replay protection; sensitive payloads are minimized and are not written into ordinary logs.
- Integration availability and entitlements are checked server-side; disabled/unconfigured integrations fail safely and clearly.

**Dependencies:** Security/legal/provider review, production backend, entitlement design, privacy and retention policy.

### E2.9 — Support verified multi-tenant custom domains

**User story:** As an app owner, I want a verified domain to serve my published app so visitors can use my brand's address.

**Description:** Design provider-neutral domain verification, TLS certificate lifecycle, host-to-app resolution, tenant isolation, canonical URLs, and safe removal/transfer. DNS instructions and edge-routing implementation must follow the hosting provider selected after deployment/security review; a fixed AWS Mumbai region or Redis lookup is not an agreed requirement.

**Acceptance criteria**
- A domain is mapped only after a challenge proves control; duplicate, pending, expired, or already-claimed domains cannot route to an app.
- Requests accept only validated hostnames and map them to an active, published app; spoofed forwarding headers and path traversal cannot select another tenant.
- TLS issuance/renewal, verification status, DNS misconfiguration, disablement, and removal are observable and have documented recovery procedures.
- Unknown hosts, unpublished apps, and removed mappings return safe responses; redirects/canonical metadata cannot enable host-header poisoning.
- Integration tests demonstrate tenant isolation, verification, renewal failure, domain reassignment, and cache invalidation.

**Dependencies:** Production deployment/edge provider choice, E2.2, domain/TLS operational ownership, security review.

### E2.10 — Generate a constrained standalone web export

**User story:** As an eligible app owner, I want a reproducible export for an approved deployment target so I can host a supported app outside the platform.

**Description:** Define export output and supported capabilities before implementation. Build from an immutable published revision in an isolated job with pinned inputs and bounded resources. Clearly disclose features requiring platform services (auth, data APIs, integrations, custom domains). Minification and source-map suppression reduce accidental exposure but do not prevent inspection of browser-delivered code; never market obfuscation as a security or IP guarantee.

**Acceptance criteria**
- Export accepts only an authorized published revision, records source revision/toolchain, and produces a checksum/versioned artifact with documented deploy instructions.
- Build jobs are isolated from the control plane, have no access to arbitrary host files/secrets, apply time/resource limits, and clean temporary artifacts.
- Output includes only declared runtime assets/config and excludes authoring UI/admin routes; dependency and artifact checks verify the boundary.
- Source maps and secrets are excluded according to policy; the UI explains that shipped client code remains inspectable.
- Export is reproducible or documents known nondeterminism, and tests cover unsupported capabilities, build failures, artifact integrity, authorization, and deletion/retention.

**Dependencies:** E2.1, E2.2, publication model, target deployment support, security and IP review.

### E2.11 — Evaluate and, if approved, package a desktop/offline app

**User story:** As an organization with approved local-only workflows, I want a supported desktop application that can operate under documented network and data constraints.

**Description:** First produce a threat model and feasibility decision comparing a web wrapper (such as Electron or Tauri) with a native runtime, offline data store, update mechanism, and any local backend needs. A packaged web UI alone is not equivalent to air-gapped operation; server Java cannot be assumed to work offline without a separately supported local service and data lifecycle.

**Acceptance criteria**
- The product decision names supported operating systems, offline capabilities, data-at-rest encryption/key handling, backup/export, update/signing process, and support lifecycle—or explicitly defers the feature.
- The package contains only the approved runtime, applies an explicit navigation/content-security policy, and does not ship platform administration credentials.
- Offline and reconnect behavior defines local authentication, sync conflicts, duplicate submissions, data retention, and recovery; tests exercise network loss and device restart.
- Packages are signed and verifiable, dependencies and update channels are reviewed, and telemetry/analytics behavior is documented for offline environments.
- No “fully air-gapped” or “zero exposure” claim is made unless independently verified against the approved threat model.

**Dependencies:** Product approval, security review, supported backend/offline architecture, OS distribution/signing decisions. This story may conclude with a documented no-go.

### E2.12 — Publish, roll back, and operate application releases

**User story:** As an app owner or operator, I want controlled publication and rollback so a bad configuration or runtime deployment can be recovered without losing the editable draft.

**Description:** Add a publication workflow over validated immutable versions with a preview/review step, explicit confirmation, status visibility, rollback, and cache invalidation. Define operational ownership and observability for runtime/API errors, deployment failures, and public traffic without logging secrets or private record values.

**Acceptance criteria**
- Publish requires a valid, authorized draft and records actor, timestamp, version, and validation result on the server.
- Draft editing after publish does not change the live version; rollback selects a prior valid immutable version and can be audited.
- Preview and publication use consistent configuration contracts; cache invalidation makes publish/rollback behavior predictable.
- Operators can diagnose request/build failures using correlation IDs and aggregate metrics without credentials, session tokens, or unnecessary personal data in logs.
- Permission, failed publication, concurrent edit, rollback, cache, and recovery paths have automated coverage and an operational runbook.

**Dependencies:** E2.1, E2.3, backend publication/version APIs, deployment and observability decisions.

## 14. Proposed delivery order and cross-cutting acceptance

This is a dependency order, not a commitment to dates:

1. Resolve product/security decisions and backend contracts; complete E2.1 and production persistence/auth boundaries.
2. Implement authorized production data APIs (E2.3), then publication/version APIs and rollback (E2.12).
3. Deliver the server-renderable runtime against those published versions (E2.2), then runtime forms (E2.4) on top of the E2.3 data APIs.
4. Add metadata/SEO and locale expansion (E2.5–E2.6) once public visibility and data-exposure rules are established.
5. Decide guest/entitlement/integration scope (E2.7–E2.8) with product, privacy, and provider owners.
6. Assess separate distribution paths independently: custom domains (E2.9), web export (E2.10), desktop/offline (E2.11). None is a prerequisite to claiming the core runtime is delivered.

Every story must include automated tests for authorization and cross-app isolation where APIs are involved, keyboard/accessibility checks for user interactions, responsive/error/empty/loading states, localization fallback, and a threat-model review for externally reachable features. Production acceptance also requires API contract tests against Spring Boot; mock-server tests alone cannot prove production security or persistence.

## 15. Blueprint-to-backlog traceability

| Blueprint topic | Current status | Epic 2 destination / correction |
| --- | --- | --- |
| React 19, Next.js, TypeScript, Tailwind/DaisyUI, dnd-kit, Zustand, TanStack Query, RHF/Zod | Implemented in current frontend to varying feature scopes | Extend and verify per runtime story; these tools do not provide backend validation or authorization |
| Basemodel, page canvas, browser drafts, auth/localization | Partial current authoring foundation | Epic 0 completes authoring contracts; E2.1, E2.3, E2.7 define production versions and migration |
| Runtime app engine and catch-all routes | Not implemented | E2.1–E2.4 |
| Automatic database schema/REST/GraphQL compilation | Not implemented; not assumed | Requires separate backend architecture/security decision; arbitrary code/queries are out of scope |
| SEO, dynamic metadata and JSON-LD | Not implemented | E2.5; only validated public data may be exposed |
| Guest tiers, advanced-feature gates, SMS/payment nodes | Not implemented | E2.7–E2.8; entitlement and side-effect checks are server-enforced |
| Hindi, Marathi, Tamil, Telugu | Not implemented; current UI is English/Spanish | E2.6 after translation ownership and locale approval |
| Custom domains/AWS/Redis | Not implemented; vendor/region/cache choices are open | E2.9; do not treat blueprint-specific infrastructure as selected |
| Standalone export and proprietary-code isolation | Not implemented; client bundles remain inspectable | E2.10; no source-secrecy guarantee |
| Electron/Tauri, GraalVM, local database, air-gapped package | Not implemented and not validated as a design | E2.11 begins with feasibility/security decision; may be rejected |
