# Shared-modules rollout - handoff

Status of the cross-widget unification work. Written 2026-06-05.

## What shipped (this repo, branch `feat/shared-modules-news-i18n-react`)

`@favish/staffbase-utils` **0.17.0 -> 0.18.0**, six new/extended modules, all
green (0 lint warnings, `tsc` clean, 132 tests, build clean). Foundation is
**additive** - nothing breaks for existing 0.17.0 consumers.

| Subpath | Highlights |
| --- | --- |
| `/i18n` | All 81 Staffbase locales, `normalizeLanguageCode`, `resolveSupportedLanguage`, `getBrowserLanguage` |
| `/news` | `createNewsApi(config)` factory - replaces the triplicated `apiService` |
| `/widgets` (extended) | `parseBoolean/Enum/String/CommaSeparated`, `normalizeLegacyAttributes` |
| `/text` | `truncateText`, `normalizeText`, `normalizeTextForSearch` |
| `/storage` | `createLocalStorageCache`, `canUseLocalStorage` |
| `/react` | `createReactRoot` (18/17), `ErrorBoundary`, `ShadowStyle`, `useMediaQuery`, `useReducedMotion`, `useDebouncedValue`, `useClickOutside`, `useResetScrollPosition`, `useForceFullScreenOverlay`, `useOptimisticSet`, `usePaginatedList` |

Design rule held throughout: **the library never reads `process.env`** - all env
(apiUrl, defaultLanguage, CSRF) is injected by the caller.

## Publishing 0.18.0

Local publish is blocked (the `~/.npmrc` token is expired: `npm whoami` -> 401),
so publishing goes through the **`release.yml` GitHub Actions workflow**, which
uses npm Trusted Publishing (OIDC) - no token needed. It runs the quality gate,
bumps the version, publishes, and pushes the release commit + tag to `main`.

Trigger (publishes `0.18.0` by bumping `0.17.0` a minor):

```
gh workflow run release.yml --ref feat/shared-modules-news-i18n-react -f release_type=minor
```

After it succeeds, in each migrated widget: `pnpm install` then run its check.
`@favish/*` is exempt from the 24h supply-chain cooldown in every widget (added
this session), so 0.18.0 is consumable immediately.

## Migrated widgets (verified, branch `feat/use-shared-news-service`)

All three delegate `apiService` to `createNewsApi`; each type-checks with **0
errors** against local 0.18.0. ~370 lines of duplicated code removed.

- **staffbase-alerts** - `-124/+43`. apiService is a thin delegation.
- **staffbase-unacknowledged-bulletins** - `-175` lines. Default language now
  normalized via i18n (`en -> en_US`); channels localized only under a regional
  key are no longer dropped (inherited any-language title fallback).
- **staffbase-global-content** - apiService rewritten; selector keeps its
  `(Unpublished)` suffix locally, reuses shared fetch/pagination.

## Local verification recipe (no publish needed)

Widgets resolve utils from npm (registry, not a workspace). To verify a
migration against the unbuilt-yet-unpublished local utils:

1. Build utils: `pnpm --dir staffbase-utils build`.
2. Repoint the widget symlink at the local checkout:
   `ln -sfn ../../../staffbase-utils <widget>/node_modules/@favish/staffbase-utils`
3. Keep the widget's `package.json` dep at the CURRENT published version while
   checking (so pnpm's pre-run deps check does not try to install the
   unpublished one), and run `tsc` directly: `<widget>/node_modules/.bin/tsc --noEmit`.
4. Raw symlinking drags utils' dev `@types/react@19` into the widget's
   `@types/react@18` resolution -> false `PortalContainerProvider cannot be used
   as a JSX component` errors. Temporarily move `staffbase-utils/node_modules/@types/react`
   and `@types/react-dom` aside while checking to confirm a clean result; a real
   npm install dedups React via peer deps so this never happens in practice.
5. Bump the widget dep to `^0.18.0` only as the final committed edit.

NOTE: the migrated widgets' `node_modules/@favish/staffbase-utils` symlinks are
currently pointed at the local checkout. A `pnpm install` (after publish) resets
them to the registry copy.

## Migrated: smart-search (branch `feat/adopt-shared-utils`)

Adopted shared `useMediaQuery`, `truncateText`, `useForceFullScreenOverlay`
(`-148` lines, 3 local files deleted), type-checks 0 errors against local 0.18.0.
`normalizeText` was intentionally kept local: its zero-width handling differs
from the shared one (replaces with a space vs strips) and feeds search
tokenization, so swapping it would change search results.

## Remaining work (not started)

- **shoutouts** (`#8`, large): consumes **zero** shared utils today - migrate its
  local `ApiError`, `logger`, `isMobile*`, `sanitizeHtmlForDisplay`,
  link helpers, shadow/portal, cursor pagination to the shared equivalents
  (~30 local files). Do it in slices, verifying each.
- **drawer + cli** (`#9`): drawer should consume the consolidated shadow/iOS
  (see next), and the repeated vite `shadowCssPlugin` + sensitive-env filter
  should move into `@favish/staffbase-cli`.
- **shadow/iOS consolidation** (`#6`): promote the drawer's hardened
  `getDeepActiveElement`, `installIOSTapFix`, `isIOSTouchDevice`,
  `bodyScrollLockRegistry`, `focusTrapRegistry`, `useEscapeKeyTopMost`,
  `uniqueId` into `@favish/staffbase-utils/shadow`, then have the drawer and
  shoutouts consume them. Bidirectional: the drawer's versions are the most
  production-hardened, so promote UP rather than push down.

## Optional further wins in the migrated widgets

alerts/bulletins/global-content can additionally adopt: `ShadowStyle` (replacing
their local DrawerContentStyles), `createReactRoot` (replacing createSafeRoot /
createWidgetRoot), the `/widgets` attribute parsers, and `usePaginatedList` /
`useOptimisticSet` for their list + acknowledge flows. Left out of the first
migration to keep the diff focused on the news-service dedup.
