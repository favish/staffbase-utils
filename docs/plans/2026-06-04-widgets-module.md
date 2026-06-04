# /widgets Module Implementation Plan

> **Execution:** Inline. The most important + riskiest module (private-API hack
> over `window.staffbase.content.widgetMgr`). Build core (React-agnostic) +
> `/widgets/react` adapter, tarball-verify, publish 0.5.0, then migrate.

**Goal:** Ship `@favish/staffbase-utils/widgets` (`renderWidgets`) and
`@favish/staffbase-utils/widgets/react` (`useRenderWidgets`) as the canonical
superset of the four widgetService/apiService variants.

**Architecture:** Core takes an `HTMLElement` (not a React ref) and returns a
typed `RenderWidgetsResult`. Module-level **global queue** serializes all renders
(avoids racing on the host's shared `_widgets`); a **WeakMap keyed by cancelKey**
drops superseded renders (no `AbortController`, for old webviews). Constructor
path first, prototype fallback. React adapter is a separate entry; `react` is an
optional peer used only there.

**Tech Stack:** TS, Vite multi-entry (adds `widgets` + `widgets/react`), Jest
(jsdom). No new runtime deps.

---

## Superset (from §2 maturity ranking + §3.1)

- alerts (constructor-first + prototype fallback, WeakMap per-ref cancel, retries,
  warn-once) is the spine.
- unack contributes the **global serialization queue** and the **known-error
  swallow** (`each`, `undefined is not an object`, `is not a function`).
- global-content contributes the **typed failure signal** (it set
  `data-widget-render-error`); the lib returns `{ ok:false, reason }` and the
  consumer decides what to do (keeps the lib DOM-only).
- smart-search: subsumed (minimal).

### Public API (§3.1)

```ts
function renderWidgets(container: HTMLElement | null, options?: RenderWidgetsOptions): Promise<RenderWidgetsResult>

interface RenderWidgetsOptions {
  maxRetries?: number   // default 10
  retryDelay?: number   // default 300 ms
  onError?: (error: unknown, context: string) => void // default: warn critical-only
  cancelKey?: object    // default: the container element
}

type RenderWidgetsResult =
  | { ok: true; rendered: number }
  | { ok: false; reason: 'no-container' | 'manager-unavailable' | 'no-widgets' | 'cancelled' }
```

`rendered` is the prototype-path widget count; it is `0` when the host constructor
path handled rendering (count unknown). Document this.

## File layout (atomic rule; stateful orchestrator holds module state, pure helpers extracted)

Types (`src/types/widgets/`):
- `RenderWidgetsOptions.ts`, `RenderWidgetsResult.ts`
- `StaffbaseWidgetManagerConstructor.ts`, `StaffbaseWidgetManagerPrototype.ts`
- `UseRenderWidgetsOptions.ts` (react)

Core (`src/widgets/`):
- `getWidgetManagerConstructor.ts` — reads `window.staffbase.content.widgetMgr` if it's a function.
- `getWidgetManagerPrototype.ts` — reads `...widgetMgr.prototype`.
- `hasRequiredWidgetManagerMethods.ts` — type guard (`_extractWidgets` + `_renderWidget`).
- `isKnownStaffbaseRenderError.ts` — predicate for swallowed internal errors.
- `renderWidgets.ts` — orchestrator: global queue + WeakMap cancel + retry loop + warn-once.
- `index.ts`

React (`src/widgets/react/`):
- `useRenderWidgets.ts`, `index.ts`

## Task 1: types

```ts
// RenderWidgetsResult.ts
export type RenderWidgetsResult =
  | { ok: true; rendered: number }
  | {
      ok: false
      reason: 'no-container' | 'manager-unavailable' | 'no-widgets' | 'cancelled'
    }
```
```ts
// RenderWidgetsOptions.ts
export interface RenderWidgetsOptions {
  maxRetries?: number
  retryDelay?: number
  onError?: (error: unknown, context: string) => void
  cancelKey?: object
}
```
```ts
// StaffbaseWidgetManagerConstructor.ts
export type StaffbaseWidgetManagerConstructor = new (
  ...args: unknown[]
) => { render?: (container: HTMLElement) => Promise<void> | void }
```
```ts
// StaffbaseWidgetManagerPrototype.ts
export interface StaffbaseWidgetManagerPrototype {
  _widgets?: unknown[]
  _extractWidgets?: (container: HTMLElement) => unknown[]
  _renderWidget?: (
    this: StaffbaseWidgetManagerPrototype,
    container: HTMLElement,
    widget: unknown,
  ) => void
}
```

## Task 2: pure helpers (each its own file + test)

- getWidgetManagerConstructor / getWidgetManagerPrototype: read window via a
  typed cast (no `window.staffbase` global typing needed inline).
- hasRequiredWidgetManagerMethods: both methods are functions.
- isKnownStaffbaseRenderError: TypeError whose message includes `each` or
  `undefined is not an object`.

## Task 3: renderWidgets orchestrator (TDD)

Module state: `let queue = Promise.resolve()`, `const cancelTokens = new WeakMap<object, number>()`,
`let hasWarnedManagerUnavailable = false`.

Behavior:
- `container` null -> `{ ok:false, reason:'no-container' }` (no queueing).
- Bump `cancelTokens.get(cancelKey)` -> runId; chain execution onto `queue`.
- Execute: retry up to maxRetries; each attempt: cancelled check; container still
  has `querySelectorAll`; constructor path (`new ctor(undefined,false).render`)
  -> `{ ok:true, rendered:0 }`; else prototype path (ensure `_widgets` array,
  `_extractWidgets`, render each with cancelled-check + known-error swallow ->
  `{ ok:true, rendered }`); 0 widgets -> retry after `retryDelay`.
- After retries: never saw a manager -> warn-once + `{ ok:false, reason:'manager-unavailable' }`;
  saw it but no widgets -> `{ ok:false, reason:'no-widgets' }`.

Tests (jsdom, stub `window.staffbase.content.widgetMgr`):
- no container -> no-container.
- prototype with 2 widgets -> `{ ok:true, rendered:2 }`, both `_renderWidget` calls made.
- prototype `_extractWidgets` returns [] every attempt (use maxRetries:1) -> no-widgets.
- no manager (delete window.staffbase) maxRetries:1 -> manager-unavailable, onError called once.
- swallows a `_renderWidget` TypeError('... each ...') without rejecting.
- constructor path: stub ctor whose `render` resolves -> `{ ok:true, rendered:0 }`.
- cancellation: two renders with the same cancelKey; the first returns cancelled.

## Task 4: React adapter

```ts
// UseRenderWidgetsOptions.ts
import type { DependencyList } from 'react'
import type { RenderWidgetsOptions } from './RenderWidgetsOptions'
export interface UseRenderWidgetsOptions extends RenderWidgetsOptions {
  observe?: boolean
  deps?: DependencyList
}
```
```ts
// useRenderWidgets.ts
import { useEffect } from 'react'
import type { RefObject } from 'react'
import { renderWidgets } from '../renderWidgets'
import type { UseRenderWidgetsOptions } from '../../types/widgets/UseRenderWidgetsOptions'

export const useRenderWidgets = (
  ref: RefObject<HTMLElement | null>,
  options: UseRenderWidgetsOptions = {},
): void => {
  const { observe = false, deps = [], ...renderOptions } = options
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const opts = { ...renderOptions, cancelKey: el }
    void renderWidgets(el, opts)
    if (!observe) return
    let timer: ReturnType<typeof setTimeout>
    const observer = new MutationObserver(() => {
      clearTimeout(timer)
      timer = setTimeout(() => void renderWidgets(ref.current, opts), 100)
    })
    observer.observe(el, { childList: true, subtree: true })
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
```
React entry is excluded from the jsdom unit suite unless RTL is available; keep a
minimal render/observe test only if `@testing-library/react` is present (it is
NOT a lib dep) — otherwise cover the hook indirectly via the widget smoke test.

## Task 5: wire build + publish

- vite.config.ts entries: add `widgets` and `'widgets/react'`.
- package.json exports: `./widgets` and `./widgets/react`.
- type-check + lint + test + build green; verify `react` stays external and the
  core `widgets` bundle does NOT import react.
- `npm pack`; install tgz in alerts; smoke-test `/widgets` (+ `/widgets/react`
  via RTL which alerts has); revert.
- Commit; push main; release minor -> 0.5.0 (no new deps to age-pin).

## Task 6: migrate widgets (one commit per widget)

- **alerts:** replace `services/widgetService.ts` usage. In ArticleLoader.tsx,
  replace the manual `useLayoutEffect` + MutationObserver + `renderWidgets(contentRef)`
  with `useRenderWidgets(contentRef, { observe: true })` (the hook encapsulates the
  observer). Delete local `services/widgetService.ts`. Bump ^0.5.0.
- **unack:** same shape (it has the same ArticleLoader observer pattern). Delete local.
- **smart-search:** ResultItem/SmartSearch call `renderWidgets(ref)`; switch to
  `renderWidgets(ref.current, { ... })` or the hook. Delete local.
- **global-content:** SPLIT `renderWidgets` out of `services/apiService.ts` (leave
  apiService fetch-only). Its caller renders via the lib; map `{ ok:false }` to the
  `data-widget-render-error` attribute in the component. Bump ^0.5.0 (needs the
  age-exclude entry like /html did).
- Each: type-check + lint + test green; commit; push.

---

## Self-review

- §2 + §3.1 covered: constructor-first + prototype fallback, BOTH concurrency
  models (queue + WeakMap), retries, known-error swallow, warn-once, typed result,
  React hook with optional observer. React optional peer, used only by /widgets/react.
- §6: global-content apiService becomes fetch-only.
- Webview safety: no AbortController, no env/process, no Node globals.
- Behavior preservation: each widget keeps its render-on-change behavior via the
  hook's `observe` + `deps`.
