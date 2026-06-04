# Widget standardization pattern

How Favish Staffbase widgets consume `@favish/staffbase-utils` consistently.
The `staffbase-alerts` widget is the reference implementation; copy its shape
when building or migrating a widget.

## 1. Import conventions

- Import from the specific subpath, never the package root, so the bundler can
  tree-shake: `@favish/staffbase-utils/log`, `/api`, `/html`, `/links`,
  `/widgets`, `/content`, `/device`, `/dom`, `/host`, `/shadow*`, `/types`,
  `/types/news`, `/types/pages`, `/types/user`, `/types/groups`.
- Use `import type { ... }` for type-only imports.
- One exported symbol per file; entity types live under `types/<area>/`, pure
  helpers under `utils/<area>/`, IO under `services/<area>/`.

## 2. Boot setup (index entry)

- Logging: call `setLoggingEnabled(...)` once at startup. The `/log` helpers are
  silent by default and gated by this single runtime flag (webview-safe; the lib
  never reads host env directly).
- Rendering nested Staffbase content: `renderWidgets` from `/widgets`.
- Shadow DOM mounting: `ensureShadowMount` / `PortalContainerProvider` from
  `/shadow/react` (or `/shadow/portal` when Emotion is not needed).
- Env vars: read literal `import.meta.env.VITE_*` (Vite) or literal
  `process.env.REACT_APP_*` where the toolchain statically replaces it. Never
  access env dynamically and never reference Node globals at runtime.

## 3. Data layer

- `services/<area>/*` owns IO and returns the wire types from `/types*`.
- Single resource read: `fetchJson<T>(url, init?)`. It uses
  `credentials: 'include'`, throws `ApiError` (carrying `status`) on non-2xx, and
  forwards `init` (so pass `{ signal }` for abort). Branch on a missing resource
  with `err instanceof ApiError && err.status === 404`.
- Paginated collection read: `fetchAllPaginated<TItem, TSource>(baseUrl, opts)`.
  Type the raw page items with `TSource` (e.g. `Channel`, `Post`) and map to
  `TItem` via `mapItem`; pass `onError: logError` so truncation is never silent.
- Route handlers / hooks stay thin: validate, call one service, return.

## 4. View models over wire types

Keep the wire type from the lib as the input; model the widget's presentational
shape separately. To override a single field of a wire type, use `Omit` so the
divergent field is intentional and visible:

```ts
// types/ArticleData.ts (alerts / unacknowledged-bulletins)
export interface ArticleData extends Omit<Post, 'acknowledgements'> {
  // Optimistic per-user UI flag; the wire Post.acknowledgements is a
  // { total, limit, offset } counter, not assignable to this.
  acknowledgements?: Acknowledgements
}
```

When the view model is fully flattened/resolved (no longer Post-shaped), keep it
as an independent local type and produce it from a pipeline of small
single-purpose functions (see global-content `ParsedArticleData` +
`processArticleData`).

## 5. Conservative type-adoption rule

Adopt a lib entity type ONLY when the local type is a 1:1 match or a clean
superset of it. If the shape diverges, keep the type local and document why.
Reasons a type legitimately stays local:

- It is a different API surface than the lib models (search-API results, a
  widget's own backend DTOs, the Widget runtime `getUserInformation()` shape vs
  the management `User` read endpoint).
- It is a view model (see section 4) or widget-config/props shape.
- Field names or required/optional split differ (e.g. a `{ label, value }`
  selector option is not the lib `DropdownOption` `{ id, title }`).

Do not force a type or change runtime behavior to fit the lib.

## 6. Verification gate (per repo, before commit)

All green, no exceptions:

```bash
pnpm run type-check
pnpm run lint
pnpm run test
pnpm exec staffbase-cli build <non-prod-env>   # e.g. staging
```

If anything fails and cannot be made green, stop and report; do not commit a
broken state.

## 7. Current adoption status (2026-06)

| Widget | Lib types | Lib utils | Notes |
| --- | --- | --- | --- |
| staffbase-alerts | `Post`, `Channel`, `LocalizedContent`, `DropdownOption` | full | Reference implementation. `ArticleData = Omit<Post,'acknowledgements'>`. |
| staffbase-unacknowledged-bulletins | same as alerts | full | Same view-model pattern. |
| staffbase-global-content | `Post`, `Channel`, `LocalizedContent`, `DropdownOption` | `/log`, `/html`, `/api` (`fetchJson`, `fetchAllPaginated`), `/widgets` | View model is the flattened `ParsedArticleData`. |
| staffbase-smart-search | none (uses `/log`, `/html`, `/links`, `/widgets`, `/shadow/portal`) | partial | Search-result types stay local (Elasticsearch shapes). Its `services/api/*` stays local: it needs dev Basic-auth, request caching and a `{ data, total }` envelope that the lib `/api` helpers do not provide. |
| staffbase-shoutouts | none | none | Intentional exception. DTOs come from its own backend, not the Staffbase management API. Its platform-adjacent utils are deliberately divergent: always-on error logging, a strict sanitize allowlist matched to its backend, `openLinkInternal` for in-app OAuth, and an env-based `/openlink` deep-link builder. Adopting the lib equivalents would change behavior, so they stay local. |
