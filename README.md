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
| `@favish/staffbase-utils/log` | `logError`, `logWarn`, `logDebug`, `setLoggingEnabled` |
| `@favish/staffbase-utils/dom` | `getDynamicClasses` |
| `@favish/staffbase-utils/types` | `Channel`, `ChannelLink`, `ChannelLinkParameter`, `DropdownOption` (type-only) |

More modules (`/env`, `/device`, `/html`, `/links`, `/widgets`) are added per the
delivery roadmap; each is its own subpath so consumers only bundle what they import.

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
