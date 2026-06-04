# /links Module Implementation Plan

> **Execution:** Inline (subagents unusable here). Build in the lib, tarball-verify,
> publish via CI (`release_type=minor` -> 0.4.0), migrate widgets.

**Goal:** Ship `@favish/staffbase-utils/links` as the canonical home for the
Staffbase link-handling helpers + safety guards, then migrate the 3 widgets that
use them (global-content has none).

**Architecture:** One exported symbol per file under `src/links/`. Port the alerts
**superset** verbatim (alerts has the strongest variants). `normalizeInAppLinks`
already takes the Staffbase origin as a parameter (no env access in the lib).

**Tech Stack:** TypeScript, Vite lib mode, Jest (jsdom). No new runtime deps
(pure DOM/window).

---

## Superset decision (per §4/§5; record in file comments + PR)

| Export | Winner | Why |
| --- | --- | --- |
| `tryOpenWithStaffbase(href)` | alerts == unack | Typed `isPromiseLike` guard (smart-search used `as any`). |
| `openStaffbaseAware(href)` | **alerts** | Only alerts guards with `isSafeNavigationHref` before navigating (blocks javascript:/data:/vbscript:). unack + smart-search lack it. |
| `normalizeInAppLinks(root, origin)` | **alerts** | Only alerts hardens cross-origin `target=_blank` with `rel=noopener` (reverse-tabnabbing). Origin is a param already. |
| `getInAppOpenLinkTarget(href, baseUrl)` | alerts == unack | Identical. |
| `isSafeNavigationHref(href)` | alerts (promote) | Security guard. |
| `isAllowedIframeSrc(src)` | alerts (promote) | Iframe-src allowlist; consumed by /html's sanitizeArticleHtml via injected predicate. After this ships, alerts imports it from the lib. |

Types: `TryOpenResult`, `WindowWithStaffbase` in `src/types/links/`.

migration behavior changes (safe improvements):
- smart-search `openStaffbaseAware` gains the `isSafeNavigationHref` guard.

## Task 1: types + entry/export wiring

- Create `src/types/links/TryOpenResult.ts`, `src/types/links/WindowWithStaffbase.ts`.
- vite.config.ts: add `links: resolve(__dirname, 'src/links/index.ts')` to `entries`.
- package.json: add `./links` export block (mirror `./html`).

## Task 2: port the six functions (one file each) + tests

Port verbatim from alerts (the superset). Files:
- `src/links/isSafeNavigationHref.ts`
- `src/links/isAllowedIframeSrc.ts`
- `src/links/tryOpenWithStaffbase.ts` (imports both types)
- `src/links/openStaffbaseAware.ts` (imports tryOpenWithStaffbase + isSafeNavigationHref)
- `src/links/getInAppOpenLinkTarget.ts`
- `src/links/normalizeInAppLinks.ts`
- `src/links/index.ts` (named re-exports, alphabetical)

Tests (jsdom):
- isSafeNavigationHref: blocks `javascript:`/`data:`/`vbscript:`, allows `https://`/relative/`mailto:`.
- isAllowedIframeSrc: allows youtube/vimeo/staffbase + same-origin; rejects evil.com + non-http(s).
- getInAppOpenLinkTarget: strips `/deeplink/` + `/openlink/` for same-origin; returns null for `#`/`mailto:`; passes cross-origin through.
- normalizeInAppLinks: rewrites same-origin to relative + adds `internal-link` + removes target; adds `rel=noopener` to cross-origin `target=_blank`.
- openStaffbaseAware: returns false for empty + for `javascript:` href; with a stubbed `window.staffbase.plugin.util.openLink`, returns true and calls it.

## Task 3: build + tarball verify + publish

- type-check + lint + test + build green.
- `npm pack`; install tgz in alerts; smoke-test the `/links` subpath; revert.
- Commit `feat(links): ...`; push main; release minor -> 0.4.0.

## Task 4: migrate widgets (one commit per widget)

- **alerts:** repoint `getInAppOpenLinkTarget`, `normalizeInAppLinks`, `openStaffbaseAware`,
  and `isAllowedIframeSrc` (in ArticleLoader.tsx) to `@favish/staffbase-utils/links`.
  Delete local `staffbaseOpenLink.ts`, `normalizeInAppLinks.ts`, `linkHandling.ts`,
  `isSafeNavigationHref.ts`, `isAllowedIframeSrc.ts` (+ any orphaned tests). Bump ^0.4.0.
- **unack:** repoint the three (useInAppLinkHandling.ts + Article.tsx). Delete local
  `staffbaseOpenLink.ts`, `normalizeInAppLinks.ts`, `linkHandling.ts`. Bump ^0.4.0.
- **smart-search:** repoint `openStaffbaseAware` (ResultItem.tsx) to the lib. Delete
  local `utils/navigation/openStaffbaseLink.ts`. Bump ^0.4.0.
- global-content: none.
- Each: type-check + lint + test green (global-content untouched), commit, push.

---

## Self-review

- §5 /links variants all covered (staffbaseOpenLink x3, normalizeInAppLinks x2,
  linkHandling x2, isAllowedIframeSrc, isSafeNavigationHref).
- §4 promotes the alerts guards: done.
- Webview safety: no env/process; origin + baseUrl are parameters.
- Behavior preservation: alerts/unack identical; smart-search gains the nav guard
  (documented).
