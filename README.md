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
| `@favish/staffbase-utils/log` | `logError`, `logWarn`, `logDebug`, `setLoggingEnabled` |

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
tokens, no OTP. To cut a release:

1. Bump the version in `package.json` (and commit).
2. Tag it and push:
   ```bash
   git tag v0.1.1
   git push origin main --tags
   ```
3. The `Publish to npm` workflow (`.github/workflows/publish.yml`) builds, verifies,
   and publishes the version from `package.json` with provenance.

The published version is taken from `package.json`; the tag is only the trigger.

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
