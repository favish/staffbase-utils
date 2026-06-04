# /html Module Implementation Plan

> **Execution:** Inline (subagents are unusable in this session — they inherit the
> huge global context and fail with "Prompt is too long"). Build the module in the
> lib, tarball-verify against a widget, publish via CI, then migrate all 4 widgets.

**Goal:** Ship `@favish/staffbase-utils/html` as the canonical home for the four
HTML helpers duplicated across the widgets, then migrate every widget to it.

**Architecture:** One exported symbol per file under `src/html/`. The rich
article sanitizer uses an **isolated DOMPurify instance** so its hardening hooks
never pollute the consumer's shared DOMPurify. The iframe allowlist is an
**injected predicate option** so `/html` stays decoupled from `/links` (which ships
later and owns `isAllowedIframeSrc`).

**Tech Stack:** TypeScript, Vite library mode (es+cjs+dts), Jest (jsdom),
`dompurify ^3.4.7` (new runtime dependency, externalized in the build).

---

## Superset decision (record at top of each file + in PR descriptions)

Five variants collapse to FOUR behavior-preserving exports:

| Export                                | From           | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `sanitizeArticleHtml(html, options?)` | alerts + unack | Rich sanitize. Keeps `iframe` + `data-*`. `USE_PROFILES html`, ADD_ATTR union `[target, allow, allowfullscreen, frameborder, scrolling, loading, referrerpolicy]`, FORBID_TAGS `[script,style]`, FORBID_ATTR `[onerror,onload,onclick]`. Isolated DOMPurify instance. Always forces `rel="noopener noreferrer"` on `target="_blank"` anchors. Optional `options.isAllowedIframeSrc` drops non-allowlisted iframes (alerts hardening, decoupled from /links). |
| `sanitizeHtml(html)`                  | global-content | Strict bare `DOMPurify.sanitize(html)` (default profile strips iframes). Preserves teaser behavior exactly. Default DOMPurify instance.                                                                                                                                                                                                                                                                                                                      |
| `stripHtmlTags(html?)`                | smart-search   | `ALLOWED_TAGS:[]`, `KEEP_CONTENT:true`; regex fallback on throw. Drops smart-search's `html-react-parser` fallback branch (avoids a heavy lib dependency).                                                                                                                                                                                                                                                                                                   |
| `cleanHTML(html)`                     | alerts         | `stripHtmlTags(html)` then `.toLowerCase()` + de-punctuate + collapse whitespace + trim. Search-index normalization.                                                                                                                                                                                                                                                                                                                                         |

Type: `SanitizeArticleHtmlOptions` in `src/types/html/`.

---

## Task 1: Add dompurify dependency + html entry/exports

**Files:**

- Modify: `package.json` (add `dependencies.dompurify`, add `./html` export)
- Modify: `vite.config.ts` (add `html` entry, externalize `dompurify`)

- [ ] **Step 1:** `pnpm add dompurify@^3.4.7` (adds to dependencies)
- [ ] **Step 2:** add `html: resolve(__dirname, 'src/html/index.ts')` to `entries`
- [ ] **Step 3:** add `'dompurify'` to `rollupOptions.external`
- [ ] **Step 4:** add `./html` block to `exports` (mirror `./device`)
- [ ] **Step 5:** `pnpm add -D @types/dompurify`? — NO. dompurify v3 ships its own
      types. Skip.

## Task 2: SanitizeArticleHtmlOptions type

**Files:**

- Create: `src/types/html/SanitizeArticleHtmlOptions.ts`

```ts
/**
 * Options for sanitizeArticleHtml.
 */
export interface SanitizeArticleHtmlOptions {
  /**
   * Predicate deciding whether an iframe src may be kept. When provided, iframes
   * whose src fails the predicate are dropped. When omitted, iframes are kept
   * (DOMPurify still blocks `src="javascript:"`). Injected so /html does not
   * depend on /links (which owns isAllowedIframeSrc).
   */
  isAllowedIframeSrc?: (src: string) => boolean
}
```

## Task 3: sanitizeArticleHtml (TDD)

**Files:**

- Create: `src/html/sanitizeArticleHtml.ts`
- Test: `src/html/sanitizeArticleHtml.test.ts`

- [ ] **Step 1: Write failing tests** covering: strips `<script>`; strips inline
      `onclick`/`onerror`; keeps `data-*` attributes; keeps allowlisted-by-default
      `<iframe>`; adds `rel="noopener noreferrer"` to `target="_blank"` anchors; drops
      an iframe when `isAllowedIframeSrc` returns false; keeps it when it returns true.

```ts
import { sanitizeArticleHtml } from './sanitizeArticleHtml'

describe('sanitizeArticleHtml', () => {
  it('strips script tags', () => {
    expect(
      sanitizeArticleHtml('<p>hi</p><script>alert(1)</script>'),
    ).not.toContain('script')
  })
  it('keeps data-* attributes', () => {
    expect(sanitizeArticleHtml('<div data-widget-id="x">a</div>')).toContain(
      'data-widget-id="x"',
    )
  })
  it('keeps iframes by default', () => {
    expect(
      sanitizeArticleHtml(
        '<iframe src="https://youtube.com/embed/x"></iframe>',
      ),
    ).toContain('<iframe')
  })
  it('adds rel noopener to target=_blank anchors', () => {
    const out = sanitizeArticleHtml(
      '<a href="https://x.com" target="_blank">l</a>',
    )
    expect(out).toContain('rel="noopener noreferrer"')
  })
  it('drops iframes failing the injected predicate', () => {
    const out = sanitizeArticleHtml(
      '<iframe src="https://evil.com"></iframe>',
      {
        isAllowedIframeSrc: (src) => src.includes('youtube.com'),
      },
    )
    expect(out).not.toContain('iframe')
  })
  it('keeps iframes passing the injected predicate', () => {
    const out = sanitizeArticleHtml(
      '<iframe src="https://youtube.com/embed/x"></iframe>',
      {
        isAllowedIframeSrc: (src) => src.includes('youtube.com'),
      },
    )
    expect(out).toContain('iframe')
  })
})
```

- [ ] **Step 2:** run, verify fail.
- [ ] **Step 3: Implement** (isolated instance + synchronous active-guard):

```ts
import createDOMPurify from 'dompurify'
import type { SanitizeArticleHtmlOptions } from '../types/html/SanitizeArticleHtmlOptions'

/**
 * Canonical sanitizer for rich article HTML rendered into a session-bearing
 * webview. Superset of alerts + unacknowledged-bulletins variants.
 *
 * Design notes:
 * - Uses a DEDICATED DOMPurify instance so the hardening hook never pollutes the
 *   consumer's shared default instance (which other code may sanitize through).
 * - Keeps iframes and `data-*` attributes (renderWidgets discovers sub-widgets
 *   via data-*), while DOMPurify strips scripts / inline handlers / javascript:.
 * - Always forces rel="noopener noreferrer" on target="_blank" anchors.
 * - Optional options.isAllowedIframeSrc drops non-allowlisted iframes; injected so
 *   this module does not depend on /links (which owns isAllowedIframeSrc).
 */
const purifier = createDOMPurify(window)

let activeIframeGuard: ((src: string) => boolean) | null = null

purifier.addHook('afterSanitizeAttributes', (node) => {
  if (!(node instanceof Element)) return
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer')
  }
  if (node.tagName === 'IFRAME' && activeIframeGuard) {
    const src = node.getAttribute('src') ?? ''
    if (!activeIframeGuard(src)) node.parentNode?.removeChild(node)
  }
})

export const sanitizeArticleHtml = (
  html: string,
  options: SanitizeArticleHtmlOptions = {},
): string => {
  activeIframeGuard = options.isAllowedIframeSrc ?? null
  try {
    return purifier.sanitize(html, {
      USE_PROFILES: { html: true },
      ADD_TAGS: ['iframe'],
      ADD_ATTR: [
        'target',
        'allow',
        'allowfullscreen',
        'frameborder',
        'scrolling',
        'loading',
        'referrerpolicy',
      ],
      FORBID_TAGS: ['script', 'style'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick'],
    })
  } finally {
    activeIframeGuard = null
  }
}
```

- [ ] **Step 4:** run, verify pass.

## Task 4: sanitizeHtml (TDD)

**Files:**

- Create: `src/html/sanitizeHtml.ts`
- Test: `src/html/sanitizeHtml.test.ts`

```ts
import DOMPurify from 'dompurify'

/**
 * Strict sanitizer for untrusted snippet/teaser HTML rendered via a non-
 * sanitizing parser (e.g. html-react-parser). Default DOMPurify profile: strips
 * scripts/handlers AND iframes. From global-content's sanitizeHtml.
 * @param {string} html - Raw HTML string.
 * @returns {string} Sanitized HTML.
 */
export const sanitizeHtml = (html: string): string => DOMPurify.sanitize(html)
```

Test: strips script; strips iframe (default profile).

## Task 5: stripHtmlTags (TDD)

**Files:**

- Create: `src/html/stripHtmlTags.ts`
- Test: `src/html/stripHtmlTags.test.ts`

```ts
import DOMPurify from 'dompurify'

/**
 * Strips all HTML tags, keeping text content. From smart-search's stripHtmlTags;
 * its html-react-parser fallback is dropped to avoid a heavy dependency — the
 * DOMPurify path plus a regex fallback is sufficient.
 * @param {string | undefined} html - String that may contain HTML.
 * @returns {string} Text with tags removed.
 */
export const stripHtmlTags = (html?: string): string => {
  if (!html) return ''
  try {
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: [], KEEP_CONTENT: true })
  } catch {
    return html.replace(/<\/?[^>]+(>|$)/g, '')
  }
}
```

Test: `'<p>Hello <b>world</b></p>'` -> `'Hello world'`; `undefined` -> `''`.

## Task 6: cleanHTML (TDD)

**Files:**

- Create: `src/html/cleanHTML.ts`
- Test: `src/html/cleanHTML.test.ts`

```ts
import { stripHtmlTags } from './stripHtmlTags'

/**
 * Normalizes HTML to a lowercase, punctuation-free, single-spaced token string
 * for search indexing/matching. From alerts' cleanHTML. Builds on stripHtmlTags.
 * @param {string} html - HTML string to clean.
 * @returns {string} Normalized text.
 */
export const cleanHTML = (html: string): string =>
  stripHtmlTags(html)
    .toLowerCase()
    .replace(/[.,!?;:"'()[\]\-_/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
```

Test: `'<h1>Hello, World!</h1>'` -> `'hello world'`.

## Task 7: index + build + tarball verify

**Files:**

- Create: `src/html/index.ts`

```ts
export { cleanHTML } from './cleanHTML'
export { sanitizeArticleHtml } from './sanitizeArticleHtml'
export { sanitizeHtml } from './sanitizeHtml'
export { stripHtmlTags } from './stripHtmlTags'
```

- [ ] type-check + lint + test + build all green in the lib.
- [ ] `npm pack`; in a widget `pnpm add file:<tgz>`; run that widget's tests; only
      proceed if green. Then revert the widget's package.json/lockfile tarball change.
- [ ] Commit lib: `feat(html): add sanitizeArticleHtml/sanitizeHtml/stripHtmlTags/cleanHTML`.
- [ ] Push to main; `gh workflow run release.yml -f release_type=minor` -> 0.3.0.

## Task 8: Migrate widgets (one commit per widget, same branch)

- **alerts:** `sanitizeArticleHtml` -> `@favish/staffbase-utils/html`, passing
  `{ isAllowedIframeSrc }` (keep local `isAllowedIframeSrc` until /links ships).
  `cleanHTML` -> lib. Delete local `sanitizeArticleHtml.ts`, `cleanHTML.ts`.
- **unack:** `sanitizeArticleHtml` -> lib (no predicate). Delete local.
- **global-content:** `sanitizeHtml` -> lib. Delete local.
- **smart-search:** `stripHtmlTags` -> lib. Delete local.
- Each: bump dep to ^0.3.0, type-check + lint + test green, commit, push (updates PR).

---

## Self-review

- Spec coverage: §5 /html variants (sanitizeArticleHtml x2, cleanHTML, sanitizeHtml,
  stripHtmlTags) all mapped. §4 divergence note (preserve iframe + data-\* allowances)
  satisfied by sanitizeArticleHtml. Decoupling from /links satisfied by injected
  predicate.
- Behavior preservation: each widget maps 1:1 to a same-behavior export.
- Type consistency: `SanitizeArticleHtmlOptions.isAllowedIframeSrc` matches usage.
- Webview safety: no `process`/Node globals. `window` is required by DOMPurify
  anyway (browser/jsdom).
