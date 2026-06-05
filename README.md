# @favish/staffbase-utils

Shared internal/host utilities for Staffbase widgets. Tree-shakeable subpath
modules; import only what you use.

## Install

```bash
pnpm add @favish/staffbase-utils
```

Widgets that enforce a `minimumReleaseAge` supply-chain cooldown should exempt the
`@favish/*` scope so freshly published versions install immediately. In the
widget's `pnpm-workspace.yaml`:

```yaml
minimumReleaseAge: 1440
minimumReleaseAgeExclude:
  - '@favish/*'
```

## Modules

| Subpath | Exports |
| --- | --- |
| `@favish/staffbase-utils/api` | `fetchJson`, `fetchAllPaginated`, `ApiError` |
| `@favish/staffbase-utils/content` | `resolveLocalizedContent`, `resolveActiveLanguage`, `detectEditorLanguage`, `detectPreviewLanguage` |
| `@favish/staffbase-utils/i18n` | `STAFFBASE_LOCALES` (all 81 supported locales), `normalizeLanguageCode`, `resolveSupportedLanguage`, `isSupportedLocale`, `defaultLocaleForLanguage`, `getBrowserLanguage` |
| `@favish/staffbase-utils/news` | `createNewsApi` (channels/articles/acknowledge service), `fetchChannels`, `fetchChannel`, `fetchArticles`, `fetchArticleById`, `fetchSpaceName`, `acknowledgeArticle`, `isArticlePublished`, `channelToOption` |
| `@favish/staffbase-utils/text` | `truncateText`, `normalizeText`, `normalizeTextForSearch` |
| `@favish/staffbase-utils/storage` | `createLocalStorageCache`, `canUseLocalStorage` |
| `@favish/staffbase-utils/log` | `logError`, `logWarn`, `logDebug`, `setLoggingEnabled` |
| `@favish/staffbase-utils/device` | `isMobile`, `isMobileOrWebview`, `isMobilePlatform`, `isMobileViewport`, `isNativeApp` |
| `@favish/staffbase-utils/dom` | `getDynamicClasses` |
| `@favish/staffbase-utils/host` | `getStaffbaseCsrfToken` |
| `@favish/staffbase-utils/html` | `sanitizeHtml`, `sanitizeArticleHtml`, `cleanHTML`, `stripHtmlTags` |
| `@favish/staffbase-utils/links` | `openStaffbaseAware`, `tryOpenWithStaffbase`, `normalizeInAppLinks`, `getInAppOpenLinkTarget`, `isAllowedIframeSrc`, `isSafeNavigationHref` |
| `@favish/staffbase-utils/links/react` | `useInAppLinkHandling` (React peer) |
| `@favish/staffbase-utils/widgets` | `renderWidgets`, `parseBooleanAttribute`, `parseEnumAttribute`, `parseStringAttribute`, `parseCommaSeparated`, `normalizeLegacyAttributes` |
| `@favish/staffbase-utils/widgets/react` | `useRenderWidgets` (React peer) |
| `@favish/staffbase-utils/react` | `createReactRoot`, `ErrorBoundary`, `ShadowStyle`, `useMediaQuery`, `useReducedMotion`, `useDebouncedValue`, `useClickOutside`, `useResetScrollPosition`, `useForceFullScreenOverlay`, `useOptimisticSet`, `usePaginatedList` (React peer) |
| `@favish/staffbase-utils/shadow` | `injectShadowStyles`, `isShadowRoot` |
| `@favish/staffbase-utils/shadow/portal` | `PortalContainerProvider`, `usePortalContainer` (React peer only, no Emotion) |
| `@favish/staffbase-utils/shadow/react` | `ensureShadowMount` (+ re-exports portal) (React + @emotion/cache peers) |
| `@favish/staffbase-utils/types` | `Channel`, `ChannelLink`, `ChannelLinkParameter`, `DropdownOption`, `LocalizedContent`, `ArticleImage`, `ArticleImageVariant` (type-only) |
| `@favish/staffbase-utils/types/news` | `Post` (+ `PostAuthor`, `PostAuthorAvatar`, `PostLikes`, `PostComments`, `PostSource`, `PostAcknowledgements`, `PostLayout`), `CreatePostBody`, `UpdatePostBody` |
| `@favish/staffbase-utils/types/pages` | `Page`, `PageContent`, `PageAccess`, `CreatePagePayload`, `UpdatePagePayload` |
| `@favish/staffbase-utils/types/user` | `User` (+ `UserName`, `UserEmail`, `UserRole`, `UserConfig`, `UserCreation`, `UserAvatar`, `UserAvatarVariant`, `UserProfile`, `UserSecret`, `UserRecoveryCode`), `CreateUserBody`, `UpdateUserBody` |
| `@favish/staffbase-utils/types/groups` | `Group` (+ `GroupConfig`, `GroupConfigLocalization`, `GroupUser`, `GroupBranch`, `GroupAccessors`, `GroupAdminsWithGroups`, `GroupUsers`), `CreateGroupBody`, `UpdateGroupBody` |

### Type modules (`types/*`)

Read types are hand-curated and validated field-by-field against live Staffbase
responses, because the official OpenAPI specs declare their read payloads as
`unknown` (news) or describe the management API rather than the runtime shape
(users/groups). Write payloads (`Create*` / `Update*`) are generated directly
from the official specs and refreshed with `pnpm run codegen:news|pages|user|groups`
(generated output lives under each module's `generated/` folder).

## Logging

The library never reads env flags directly (webview-safe: a bundled `process.env`
reference would crash inside Staffbase mobile webviews). Enable console output once
at widget startup with your own flag:

```ts
import { setLoggingEnabled } from '@favish/staffbase-utils/log'

setLoggingEnabled(import.meta.env.VITE_SHOW_CONSOLE_ERRORS === 'true')
// or, for REACT_APP_-style widgets:
// setLoggingEnabled(process.env.REACT_APP_SHOW_CONSOLE_ERRORS === 'true')
```

Disabled by default, so production stays silent. `logError`/`logWarn`/`logDebug`
forward to the matching `console` method only while enabled.

## Releasing

Publishing runs through GitHub Actions with npm **Trusted Publishing (OIDC)** — no
tokens, no OTP — same as `@favish/staffbase-drawer` and `@favish/staffbase-cli`.

Trigger the `Release` workflow (`.github/workflows/release.yml`) manually and pick a
bump type:

```bash
gh workflow run release.yml -f release_type=patch   # or minor / major / none
```

(or run it from the GitHub Actions tab). The workflow runs the quality gate
(type-check, lint, test, build), bumps + tags the version, publishes to npm with
provenance, and pushes the version commit + tag back to `main`. Use
`release_type=none` to publish the current `package.json` version as-is.

CI (`.github/workflows/ci.yml`) runs the same quality gate on every push and PR to
`main`.

## Development

```bash
pnpm install      # installs deps and runs the full verify+build via `prepare`
pnpm test         # jest
pnpm run type-check
pnpm run lint
pnpm run build    # vite library build -> dist/
```

Conventions: one exported symbol per file; types under `src/types/`; ESM + CJS
outputs per module (`*.es.mjs` / `*.cjs.js`) with generated `.d.ts`.
