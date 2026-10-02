

# Meta-Platform System Blueprint (`frontend-builder`)

A highly scalable, multi-domain, low-code/no-code Meta-Platform built with React 19, Next.js 15+ App Router, TypeScript, Tailwind CSS v4, and daisyUI. Rather than acting as a superficial graphical page builder, this system operates as a **runtime-interpreted Object-Oriented Engine**. Users define an abstract data semantic layer (`BaseModel`), which dynamically compiles backend relational database schemas, auto-generates REST/GraphQL API nodes, and paints reactive, fully localized client user interfaces at runtime.
---## 🧭 System Core Architecture & Design Philosophy
The application is strictly decoupled into two functional execution zones to preserve platform security, client-side rendering performance, and vendor-lock-free application export capabilities:

```text

[ METAPLATFORM PLATFORM FRONTEND ]
  │
  ├── 🏗️ 1. Workspace Editor Engine (/src/app/(workspace)/apps/[appId])
  │      └── Scope: Authoring layer for building schemas, layouts, workflows, and pages.
  │      └── Access Rule: Unauthenticated trial tier for Guests (Basic blocks); 
  │                       Authentication Gate for Advanced blocks/Enterprise features.
  │
  └── 🚀 2. Application Engine Module (/src/app-engine)
         └── Scope: Isolated runtime UI execution module.
         └── Paradigm: Interprets database-driven JSON to paint customer applications, 
                       while running static local configs to render the platform itself.

```


### 🔓 Guest Trial vs. Authenticated User Boundaries
To minimize user acquisition friction, anonymous visitors can access the visual layout builder directly from the public landing page without registering an account.
* **Guest User Configuration Tiers:** Guests gain unauthenticated access to standard baseline layouts, basic UI elements (text blocks, structural containers), and basic pre-configured application templates.
* **Authentication Gate Hooks:** Attempting to click advanced configurations (relational multi-object link grids, SMS/Payment integration nodes, or standalone application build export modules) triggers an automatic routing interceptor that handles redirection to the Authentication gates (`/sign-in`). All unsaved schema records are preserved locally inside the client's `localStorage` until account verification completes.

### 🔐 Intellectual Property & Bundle Protection
The `/src/app-engine` runtime is strictly isolated from the workspace editing libraries. When a user calls to compile and download a **Standalone Exported Build** version of their custom platform application, the system's build pipeline targets *only* the runtime engine modules, completely omitting the workspace authoring files (`/src/features/builder`), ensuring the platform's proprietary workspace code algorithms never leak.

---

## 🛠️ Global Technology & Resource Blueprint

All architectural modules must strictly utilize the following specific resources. Alternative layout tools or libraries are strictly prohibited:

* **Application Framework:** React 19 (Next.js 15+ App Router)
* **Language Layer:** TypeScript 5.x (Enforced Strict Mode)
* **Drag-and-Drop Interaction Engine:** `@dnd-kit/core` + `@dnd-kit/sortable`
* **Styling Layer & Component Tokens:** Tailwind CSS v4 paired with **daisyUI**
* **Global Client State Management:** **Zustand** (Separated feature micro-stores)
* **Server-State Cache Manager:** **TanStack Query v5 (React Query)**
* **Form Logic & Runtime Validation:** **React Hook Form** + **Zod**

---

## 📂 Unified Project Directory Matrix

```text
src/
├── app/                                # NEXT.JS ROUTING SHELL (APP ROUTER)
│   ├── page.tsx                        # Public Landing Page (Offerings, Redirection, Guest Trial entrance)
│   ├── (auth)/                         # Authentication Route Group (Proxied to Spring Boot backend)
│   │   ├── sign-in/page.tsx            # Standard login gateway
│   │   ├── sign-up/page.tsx            # Standard workspace registration panel
│   │   ├── forget/page.tsx             # Account recovery form page
│   │   └── logout/page.tsx             # Clears active secure session headers
│   ├── (dashboard)/                    # Post-Auth Management Interface
│   │   ├── profile/page.tsx            # User Details Page (Account settings, product tiers, billing)
│   │   └── apps/page.tsx               # Product Console Grid (Select/Create custom applications)
│   ├── (workspace)/apps/[appId]/       # VISUAL BUILDER ENVIRONMENT
│   │   ├── layout.tsx                  # Step Tracker Wrapper (Navbar, Subnavigation tabs, sequence headers)
│   │   ├── basemodel/page.tsx          # Step 1: BaseModel Schema Listing & Custom Object Generators
│   │   ├── pages/page.tsx              # Step 2: Target Application Screen Directory
│   │   ├── routing/page.tsx            # Step 3: Page Navigation Mapping & URL Configurations
│   │   ├── forms/page.tsx              # Step 4: Schema Input Form Manager Listing
│   │   ├── preview/page.tsx            # Step 5: Full Application Preview Canvas Layout
│   │   └── builder/page.tsx            # Visual Grid Canvas Designer Editor (Active Drag-and-Drop Layer)
│   └── preview/[appId]/                # STANDALONE DEPLOYMENT RUNNER
│       └── [[...slug]]/page.tsx        # Dynamic Catch-All Client Routing Layer for generated views
│
├── app-engine/                         # THE RUNTIME UI EXECUTION MODULE (SELF-RENDERING BLOCK)
│   ├── components/                     # Core Structural Representation Elements
│   │   ├── Page/                       # Layout containers, structural columns, and grid definitions
│   │   ├── Forms/                      # Uncontrolled fields mapping runtime inputs via React Hook Form
│   │   ├── Services/                   # Data binding components, table collections, and lists
│   │   └── SEO/                        # StructuredData.tsx (JSON-LD Schema.org injectors)
│   ├── hooks/                          # Automated runtime Zod factory compiler hooks
│   └── services/                       # Server-side metadata resolvers and string template parsers
│
├── components/                         # PLATFORM-WIDE SHARED ATOMIC MODULES
│   ├── ui/                             # Headless base controls utilized exclusively inside the Builder
│   └── branding/                       # Shared company logotypes and layout indicators
│
├── features/                           # DOMAIN-ISOLATED INTERACTION CONTROLLERS
│   ├── auth/                           # Client authentication requests and session verification helpers
│   ├── builder/                        # Workspace visual canvas drag handles, properties panel, hotkeys
│   └── schema-designer/                # BaseModel relationship managers and entity connection graphs
│
├── i18n/                               # REGIONAL LOCALIZATION MIDDLEWARE
│   ├── config.ts                       # Locale matching context utilities and direction controllers
│   └── locales/                        # Segmented Translation Namespace Dictionaries
│       ├── en/                         # English Fallback Standards (`builder.json`, `runtime.json`)
│       ├── hi/                         # Hindi (हिन्दी) translations
│       ├── mr/                         # Marathi (मराठी) translations
│       ├── ta/                         # Tamil (தமிழ்) translations
│       └── te/                         # Telugu (தெலுங்கு) translations
│
├── lib/                                # SHARED UTILITIES & NETWORK LAYER PROXIES
│   └── api/                            # Unified Next.js fetch interceptors targeting Spring Boot endpoints
│
├── styles/                             # CORE SYSTEM TYPOGRAPHY & DESIGN TOKENS
│   └── globals.css                     # Tailwind v4 imports + Custom DaisyUI Canvas Token Rules
│
└── types/                              # TRANS-COMPILATION SYSTEM CONTRACT TYPES
    ├── metadata.ts                     # Interfaces for BaseModel configurations, fields, and entities
    └── json-schema.ts                  # Target layouts for design configuration objects
```

---

## 🔍 Case Study Example: Dynamic SEO Architecture & Crawler Integration Flow

To support consumer-facing or public-domain software platforms, the core architecture allows builders to bind data schema fields directly to search meta tags and structured schema arrays.

### 🏢 Example Application Context: **"NaukriConnect"** (A Regional Job Portal for Tier-2 Indian Cities)
* **The Goal:** A citizen developer sets up a recruitment portal using two dynamic schemas: `JobListing` and `EmployerProfile`. Every single job listing dynamically populated via user forms needs to be crawlable and indexable by Google Jobs search spiders. 
* **The Platform Offering:** When creating the object structure under the `Basemodel` workflow step, the platform exposes an **"Enable SEO Optimizations"** configuration panel. When checked, the developer designs automated text rules mapping field schema attributes without manual code composition.

### 🛡️ End-to-End Architectural Data Flow

1. **Configuration Input:** The developer configures layout mapping fields inside their setup step dashboard:
   * **Meta Title Template:** `{{job_title}} Job Vacancy in {{location_city}} | NaukriConnect`
   * **Meta Description Template:** `Apply for the full-time {{job_title}} position at {{company_name}} in {{location_city}}. Salary: ₹{{salary}}/month.`
2. **Persistence Layer:** The setup values are structural configuration metadata elements saved inside MongoDB:
   ```json
   {
     "appId": "naukri_connect_452",
     "seoProfile": {
       "enabled": true,
       "titleTemplate": "{{job_title}} Job Vacancy in {{location_city}} | NaukriConnect",
       "descriptionTemplate": "Apply for the full-time {{job_title}} role at {{company_name}} in {{location_city}}.",
       "schemaType": "JobPosting"
     }
   }
   ```
3. **Server Interception:** A search spider hits the dynamic catch-all route at: `https://naukriconnect.in`.
4. **Resolution Logic:** Next.js intercepts the path string on the server tier inside `/src/app/preview/[appId]/[[...slug]]/page.tsx` using `generateMetadata`. The server calls the Spring Boot service to pull the custom object row database payload, parses the dynamic `{{brackets}}`, and delivers standard semantic HTML headers paired with an automated `<script type="application/ld+json">` micro-data markup module block down the wire.

---

## 🔒 Security Architecture: Direct Database Call Isolation

To prevent credential leakage, SQL/NoSQL injection variants, and cross-tenant data corruption vulnerabilities, **the frontend application layers are strictly barred from initializing direct database driver connections.** All persistence execution layers must follow a strict reverse-proxy configuration.


[ Search Crawler / Client Browser ]
│
▼ (Secure Public Web URL Request)
[ Next.js Server Tier (generateMetadata / Server Middleware) ] <--- THE SECURITY WALL
│
▼ (Private Network API Call + Encrypted Service Token Validation)
[ Java Spring Boot Microservices Engine ]
│
▼ (Isolated Data Driver Interface Call)
[ MongoDB Relational Metadata / PostgreSQL Instances ]


### Enforced Security Protocols for Contributors & AI Agents
1. **The Server Proxy Pattern:** Client browsers have **zero** connectivity to databases. Next.js Server Components act as intermediate secure reverse proxies. Database credentials, secret salts, and connection keys live strictly on server nodes (`.env.local`) and are never leaked to client bundles.
2. **String Interpolation Rules (`src/app-engine/services/`)**: String parsers resolving text wildcards (`{{property}}`) must execute strictly via secure lookup regex systems matching keys against server-sanitized object maps. Raw code executions or dynamic evaluations (`eval()`) are completely banned to prevent Remote Code Execution (RCE) vulnerabilities.
3. **Multi-Tenant Data Boundaries:** The Java Spring Boot engine must validate that data requested by the Next.js server maps strictly to a combination key constraint: `WHERE recordId = :recordId AND appId = :appId`. If an incoming query attempts to pull a row outside its authorized configuration workspace context, the core system must instantly reject the operation.
4. **Read-Only Enforcements:** Server endpoints hooked into metadata compilation layers must reside behind read-only gateway profiles. They must explicitly restrict modifications, rendering it impossible for automated indexing engines to alter operational data rows.

---

## 🚀 Post-Configuration Application Distribution & Deployment Models

Once an application's layout, `BaseModel` mappings, and workflow logic are finalized in the authoring dashboard, users can distribute and ship their compiled products through three distinct architectural options:

### 1. Multi-Tenant Custom Domain Hosting (Edge Mask Routing)
* **The Flow:** The application continues to operate on the platform's core cloud cluster (AWS Mumbai `ap-south-1`) but renders seamlessly under the user's white-labeled brand address (e.g., `://userdomain.com`).
* **The Architecture:** 
  * The user updates their DNS settings by creating an `A Record` or `CNAME` targeting the platform's edge reverse proxy.
  * Next.js App Router Middleware intercepts the incoming request header hostname, executes a high-speed check against a Redis metadata lookup table to identify the matching `appId`, and internally redirects the path to the catch-all execution route (`/preview/[appId]`).
  * The visitor receives the dynamic UI instantly without experiencing client-side frame redirects or layout delays.

### 2. Standalone Compiled Build Generation (Zero-Vendor-Lock Asset Export)
* **The Flow:** Professional developers can completely sever ties with the live cloud hosting cluster by exporting a compiled production asset bundle to deploy onto their independent server networks (e.g., Vercel, Netlify, AWS ECS).
* **The Architecture:** 
  * Clicking "Export Build" kicks off an isolated server task (using temporary Docker-in-Docker or AWS Lambda pipelines) away from the main backend thread.
  * The pipeline extracts only the user's specific database schema configuration JSON and injects it into a pre-compiled **`app-engine` runtime container shell**.
  * The engine bundles the file package using Webpack/Turbopack, strips all source map arrays (`productionBrowserSourceMaps: false`), and injects advanced control-flow obfuscation to scramble human readability. The platform outputs a single `.zip` asset ready for production server deployments.

### 3. Native Sandboxed System Application (Local Desktop App Bundle)
* **The Flow:** For maximum-security local networks, industrial warehousing terminals, or offline-first operational loops, the application can be compiled directly into a self-contained desktop package.
* **The Architecture:** 
  * The platform packs the isolated frontend runtime layout using **Electron** or **Tauri** to handle window system views.
  * To run the data structure without external network access, the Java Spring Boot service layer is processed Ahead-Of-Time (AOT) using **GraalVM Native Image** into a platform-specific machine binary.
  * The binary is paired with an embedded, local data tier (SQLite or H2 database engine) and compiled into a single executable installer bundle (e.g., `.exe` or `.dmg`) that functions completely air-gapped on the local machine.

---

### 📦 Distribution Model Matrix for Contributors

When writing pipelines inside `/src/features/builder/` related to application distribution, ensure the architectural boundaries below are rigorously enforced:

| Deployment Vector | Target Directory Dependencies | Backend Interface | Exposure Risk Profile |
| :--- | :--- | :--- | :--- |
| **Custom Domain** | `/src/app/preview/[appId]/` | Multi-tenant cloud Spring Boot APIs / Shared DB | **0%:** Source code lives completely secure inside the platform's AWS nodes. |
| **Build Export** | `/src/app-engine/` exclusive | Independent REST/GraphQL template nodes | **0%:** Authoring editor utilities are omitted; output is minified and obfuscated. |
| **System App** | `/src/app-engine/` wrapped | GraalVM Native Binary + Embedded Local SQLite | **0%:** Machine assembly execution hides underlying Java/Spring architecture. |

---

## 🌐 Scalable Multi-Lingual Indian Localization Architecture

To deliver deep localized support across multiple languages in India from day one without increasing bundle download overhead, this platform implements a dynamic **Static Namespace Dictionary Pattern**:
* All client component copy must be rendered via translation lookup abstractions. **Hardcoded text strings inside user-facing components are strictly prohibited.**
* Translation bundles are cleanly split into isolated feature namespaces (e.g., `builder.json`, `runtime.json`) inside language folder directories under `src/i18n/locales/`. This prevents users from downloading translation maps for features they are not actively using.
* Languages initially initialized include English (`en`), Hindi (`hi`), Marathi (`mr`), Tamil (`ta`), and Telugu (`te`). If a localized token is missing, the engine falls back to English to maintain UI execution stability.

---

## ⚡ Core State Management Rules

Contributors must strictly respect the state division boundaries to ensure the canvas remains lag-free under dense configuration tree calculations:

1. **Normalized Relations:** Database objects, models, and forms must be stored flat inside Zustand using key-value string maps. Relational connections must be referenced via unique string identifier lists (`ids`), providing O(1) lookup speeds.
2. **Coordinate Isolation:** Pixel calculation states, active drag matrices, and hover deltas generated by `dnd-kit` must live inside local React component state scopes. **Do not sync rapid cursor states to the global Zustand store.** Commit state updates to the store only once per drag completion sequence (`onDragEnd`).
3. **Data Cache Splitting:** Global Zustand blocks are prohibited from keeping records or responses fetched from APIs. Remote database calls, records, and credentials must be handled by **TanStack Query** to utilize built-in caching layers, background synchronizations, and resource evictions automatically.

---

## 🧪 Form State Verification & Programmatic Zod Factories

All field input forms rendered by the `app-engine/components/Forms/` module are handled by **React Hook Form** and verified via **Zod**. Because client applications are interpreted dynamically at runtime, static hardcoded schemas cannot be used. 

Form containers must read the backend layout validation constraints from the configuration JSON, map the array inside a programmatic processing block, and dynamically instantiate a Zod compilation layout shape on the fly before initializing the React Hook Form component state parameters.

---

## 🚀 Getting Started

### Project Initialization Sequence
```bash
npm install
cp .env.example .env.local
npm run dev
```
The active development playground will open at [http://localhost:3000](http://localhost:3000), with the visual authoring canvas accessible at `/apps/demo/builder`.

### Production Quality Verification
Before submitting a pull request, the active branch must pass all three production check targets with zero warnings:
```bash
npm run lint         # Asserts syntax alignment and design protocol rules
npm run typecheck    # Asserts that all compilation types resolve correctly
npm run build        # Simulates a production bundle compile execution
```


